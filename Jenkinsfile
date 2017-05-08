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
        }
    }

    elifePullRequestOnly {
        stage 'Downstream', {
            build job: 'dependencies-patterns-php-update-pattern-library-pull-request', wait: false, parameters: [
                string(name: 'pattern_library_branch', value: env.BRANCH_NAME),
                string(name: 'pattern_library_commit', value: commit)
            ]
        }
    }

    elifeMainlineOnly {
        stage 'Approval', {
            elifeGitMoveToBranch commit, 'approved'
        }
    }
}
