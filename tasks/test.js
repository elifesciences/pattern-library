/*
 *  JS testing
 */
module.exports = function(grunt) {
    "use strict";

    const _ = require('lodash');
    const fileArray = ['assets/js/**/*.js'];

    // transpile here?

    if ( grunt.config('tasks.test') ) {

        grunt.config('jasmine', {
            dev: {
                src: fileArray,
                options: {
                    specs: 'test/**/*.spec.js'
                }
            }
        });

        grunt.registerTask('test:dev', ['jasmine:dev']);

    } else {
      grunt.registerTask('test:dev', []);
    }

    grunt.registerTask('test', ['test:dev']);
};
