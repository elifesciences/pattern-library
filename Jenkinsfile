elifePipeline {
    stage 'Checkout'
    checkout scm
    def commit = elifeGitRevision()

    stage 'Project tests'
    lock('journal--ci') {
        builderDeployRevision 'pattern-library--ci', commit
        builderProjectTests 'pattern-library--ci', '/srv/pattern-library'
        // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
        // - the `xunit` formatter mangles the XML outputting also debug statements between tags
        // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs
    }

    elifeMainlineOnly {
        stage 'Approval'
        elifeGitMoveToBranch commit, 'approved'
    }
}
