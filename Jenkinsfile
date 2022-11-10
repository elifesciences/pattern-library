import EscapeString

elifePipeline {
    def commit
    def assetsImage
    def image

    node('containers-jenkins-plugin') {
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
        }

        stage 'Build images', {
            def description = EscapeString.forBashSingleQuotes(elifeGitSubrepositorySummary('.'))
            sh "IMAGE_TAG=${commit} DESCRIPTION='${description}' docker-compose -f docker-compose.yml build"
            assetsImage = DockerImage.elifesciences(this, "pattern-library_assets", commit)
            elifePullRequestOnly { prNumber ->
                // push immediately to allow downstream exploration even with automated tests failing
                assetsImage.tag("pr-${prNumber}").push()
            }
            image = DockerImage.elifesciences(this, "pattern-library", commit)
        }

        stage 'Project tests', {
            sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml up -d"
            // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
            // - the `xunit` formatter mangles the XML outputting also debug statements between tags
            // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs
            dockerComposeProjectTestsParallel('pattern-library', commit)
        }

        stage 'Smoke tests', {
            dockerComposeSmokeTests(commit, [
                'services': [
                    'test': './smoke_tests.sh ui http',
                ],
            ])
        }

        elifePullRequestOnly { prNumber ->
            stage 'Deploying to a public URL', {
                def targetUrl = "https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
                withCommitStatus(
                    {
                        def container = sh(script: "docker run -d elifesciences/pattern-library:${commit}", returnStdout: true).trim()
                        sh "mkdir -p public/"
                        sh "docker cp ${container}:/usr/share/nginx/html/. public/"
                        sh "rm public/50x.html"
                        sh "docker stop ${container}"
                        sh "docker rm ${container}"
                        sh "aws s3 sync public/ s3://ci-pattern-library/${prNumber}/ --delete"
                        sh "/usr/local/jenkins-scripts/colorize.sh You can see this pattern-library version at ${targetUrl}"
                    },
                    [
                        'name': 'pr-demo',
                        'commit': commit,
                        'targetUrl': targetUrl
                    ]
                )
            }
        }

        elifeMainlineOnly {
            stage 'Push images', {
                assetsImage.push()
                image.push()
            }
        }
    }

    elifeMainlineOnly {
        stage 'Approval', {
            checkout scm
            elifeGitMoveToBranch commit, 'approved'
        }
    }
}
