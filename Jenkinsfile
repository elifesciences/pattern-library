elifePipeline {
    def commit
    stage 'Checkout', {
        checkout scm
        commit = elifeGitRevision()
    }

    stage 'Project tests', {
        lock('pattern-library--ci') {
            builderDeployRevision 'pattern-library--ci', commit
            builderProjectTests 'pattern-library--ci', '/srv/pattern-library'
            // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
            // - the `xunit` formatter mangles the XML outputting also debug statements between tags
            // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs

            elifePullRequestOnly { prNumber ->
                stage 'Deploying to a public URL', { 
                    builderCmd 'pattern-library--ci', './archive-public.sh', '/srv/pattern-library' 
                    sh 'scp -o StrictHostKeyChecking=no elife@ci--ui-patterns.elifesciences.org:/srv/pattern-library/public.tar.gz .'
                    sh 'tar -xvzf public.tar.gz'
                    sh "aws s3 cp public/ s3://ci-pattern-library/${prNumber}/ --recursive"
                    sh "/usr/local/jenkins-scripts/colorize.sh You can see this pattern-library version at https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
                    elifeGithubPullRequestComment prNumber, "You can see this pattern-library version at https://s3.amazonaws.com/ci-pattern-library/${prNumber}/index.html"
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
