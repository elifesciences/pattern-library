elifePipeline {
    node("libraries") {
        stage 'Checkout'
        checkout scm

        stage 'Tests'
        sh './project_tests.sh'
        // it is not yet possible to retrieve a JUnit XML log to archive as a test artifact:
        // - the `xunit` formatter mangles the XML outputting also debug statements between tags
        // - the `xunit-file` formatter, which is an external plugin, doesn't seem to work with gulp-mocha-phantomjs
    }
}
