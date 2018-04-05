elifePipeline {
    def commit
    stage 'Checkout', {
        checkout scm
        commit = elifeGitRevision()
    }

    elifeOnNode(
        {
            stage 'Build images', {
                checkout scm
                sh "docker-compose build"
            }

            stage 'Project tests', {
                withCommitStatus({
                    // ensure a clean starting state
                    sh "docker-compose down -v"

                    sh "docker-compose run ci ./project_tests.sh"
                    // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
                    // - the `xunit` formatter mangles the XML outputting also debug statements between tags
                    // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs
                }, 'project-tests', commit)
            }

            stage 'Smoke tests', {
                withCommitStatus({
                    sh "docker-compose run ci ./smoke_tests.sh ui http"

                    // preserve environment to allow investigation if build fails, clean up otherwise
                    sh "docker-compose down -v"
                }, 'smoke-tests', commit)
            }

            elifePullRequestOnly { prNumber ->
                stage 'Deploying to a public URL', {
                    def url = "https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
                    elifeGithubCommitStatus commit, 'pending', 'continuous-integration/jenkins/pr-demo', 'Static website is being built', url

                    def container = sh(script: 'docker run -d elifesciences/pattern-library', returnStdout: true).trim()
                    sh "docker stop ${container}"
                    sh "docker cp ${container}:/usr/share/nginx/html public/"
                    sh "docker rm ${container}"
                    sh "aws s3 cp public/ s3://ci-pattern-library/${prNumber}/ --recursive"
                    sh "/usr/local/jenkins-scripts/colorize.sh You can see this pattern-library version at ${url}"
                    elifeGithubCommitStatus commit, 'success', 'continuous-integration/jenkins/pr-demo', 'Static website is ready', url
                }
            }
        },
        'containers--medium'
    )

    elifeMainlineOnly {
        stage 'Approval', {
            elifeGitMoveToBranch commit, 'approved'
        }
    }
}
