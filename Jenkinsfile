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
                sh "docker build -t elifesciences/pattern-library:${commit} ."
                sh "docker build -f Dockerfile.ui -t elifesciences/pattern-library_ui:${commit} --build-arg commit=${commit} ."
                sh "docker build -f Dockerfile.ci -t elifesciences/pattern-library_ci:${commit} --build-arg commit=${commit} ."
            }

            stage 'Project tests (containers)', {
                // TODO: will become a single container/command?
                sh "docker run elifesciences/pattern-library_ci:${commit} gulp test"
            }
        },
        'containers--medium'
    )

    stage 'Project tests', {
        lock('pattern-library--ci') {
            builderDeployRevision 'pattern-library--ci', commit
            builderProjectTests 'pattern-library--ci', '/srv/pattern-library'
            // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
            // - the `xunit` formatter mangles the XML outputting also debug statements between tags
            // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs

            elifePullRequestOnly { prNumber ->
                stage 'Deploying to a public URL', { 
                    def url = "https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
                    elifeGithubCommitStatus commit, 'pending', 'continuous-integration/jenkins/pr-demo', 'Static website is being built', url
                    builderCmd 'pattern-library--ci', './archive-public.sh', '/srv/pattern-library' 
                    sh 'scp -o StrictHostKeyChecking=no elife@ci--ui-patterns.elifesciences.org:/srv/pattern-library/public.tar.gz .'
                    sh 'tar -xvzf public.tar.gz'
                    sh "aws s3 cp public/ s3://ci-pattern-library/${prNumber}/ --recursive"
                    sh "/usr/local/jenkins-scripts/colorize.sh You can see this pattern-library version at ${url}"
                    elifeGithubCommitStatus commit, 'success', 'continuous-integration/jenkins/pr-demo', 'Static website is ready', url
                }
            }
        }
    }

    elifeMainlineOnly {
        stage 'Approval', {
            elifeGitMoveToBranch commit, 'approved'
        }
    }
}
