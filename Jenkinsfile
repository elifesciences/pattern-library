elifePipeline {
    def commit
    def assetsImage
    def image

    elifeOnNode(
        {
            stage 'Checkout', {
                checkout scm
                commit = elifeGitRevision()
            }

            stage 'Build images', {
                def description = _escapeString(elifeGitSubrepositorySummary('.'))
                sh "IMAGE_TAG=${commit} DESCRIPTION='${description}' docker-compose -f docker-compose.yml build"
                assetsImage = DockerImage.elifesciences(this, "pattern-library_assets", commit)
                elifePullRequestOnly { prNumber ->
                    // push immediately to allow downstream exploration even with automated tests failing
                    assetsImage.tag("pr-${prNumber}").push()
                }
                image = DockerImage.elifesciences(this, "pattern-library", commit)
            }

            stage 'Project tests', {
                withCommitStatus({
                    // ensure a clean starting state
                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml down -v"

                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml run ci ./project_tests.sh"
                    // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
                    // - the `xunit` formatter mangles the XML outputting also debug statements between tags
                    // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs
                }, 'project-tests', commit)
            }

            stage 'Smoke tests', {
                withCommitStatus({
                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml run ci ./smoke_tests.sh ui http"

                    // preserve environment to allow investigation if build fails, clean up otherwise
                    sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml down -v"
                }, 'smoke-tests', commit)

            }

            elifePullRequestOnly { prNumber ->
                stage 'Deploying to a public URL', {
                    def url = "https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
                    elifeGithubCommitStatus commit, 'pending', 'continuous-integration/jenkins/pr-demo', 'Static website is being built', url

                    def container = sh(script: "docker run -d elifesciences/pattern-library:${commit}", returnStdout: true).trim()
                    sh "docker cp ${container}:/usr/share/nginx/html/. public/"
                    sh "rm public/50x.html"
                    sh "docker stop ${container}"
                    sh "docker rm ${container}"
                    sh "aws s3 sync public/ s3://ci-pattern-library/${prNumber}/ --delete"
                    sh "/usr/local/jenkins-scripts/colorize.sh You can see this pattern-library version at ${url}"
                    elifeGithubCommitStatus commit, 'success', 'continuous-integration/jenkins/pr-demo', 'Static website is ready', url
                }
            }

            elifeMainlineOnly {
                stage 'Push images', {
                    assetsImage.push()
                    image.push()
                }

                stage 'Approval', {
                    elifeGitMoveToBranch commit, 'approved'
                }
            }
        },
        'containers--medium'
    )
}
