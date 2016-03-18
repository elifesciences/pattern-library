
module.exports = function (grunt) {
    "use strict";

    /*
     * Task configuration
     *
     * These are the settings for the tasks defined in the /tasks directory.
     * Reasonable defaults have been set but edit as required for your project.
     *
     * To prevent a task from running completely, you can
     * delete (or comment out) the appropriate configuration block for that task.
     */
    let config = {

        /******************************************************************************
         * CSS pre-processing task
         * Builds CSS from Sass source files and auto-prefixes properties as required.
         ******************************************************************************/

        css: {
            /*
             * List of files to concatenate and/or preprocess.
             * Format is an array of objects with src (array of source scss or css files)
             * and dest (destination) keys.
             */
            files: [{
                src: ['assets/sass/build.scss'],
                dest: 'source/assets/css/all.css'
            }],
            /*
             * Target browsers for autoprefixing.
             * See https://github.com/postcss/autoprefixer#browsers for a list of
             * available brower string values you can use.
             * The default shown below is the autoprefixer default selection.
             */
            autoprefix: ['> 0.5%', 'Firefox ESR', 'Opera 12.1'],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the css task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: [],
            /*
             * Any files and folders to delete prior to the build task running.
             * Delete this if you don't want to run the clean step before generating the fresh files.
             */
            clean: ['source/assets/css']
        },

        /******************************************************************************
         * Image optimisation/copy task
         * Optimises images for production and copies them into the public assets dir.
         ******************************************************************************/

        images: {
            /*
             * The source directory.
             * Source and destination paths will be taken/generated relative to this.
             */
            src: 'assets/img',
            /*
             * Target destination directory.
             */
            dest: 'source/assets/img',
            /*
             * Image files optimise and output into 'dest'.
             * Default matches any files with png/jpg/gif extensions in the source dir.
             */
            optimise: ['**/*.{png,jpg,jpeg,gif}'],
            /*
             * Image files to copy to 'dest' without optimisation.
             * Default matches any files with svg extensions in the source dir.
             */
            copy: [],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the css task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/img/**/*.{png,jpg,jpeg,gif,svg}'],
            /*
             * The desired optimisation level.
             * Values from 0 - 7 inclusive. Defaults to 3.
             */
            optimizationLevel: 3,
        },

        /******************************************************************************
         * JavaScript build task
         * Uses Uglify JS to concatenate and compress JS files as needed.
         ******************************************************************************/

        scripts: {
            /*
             * List of files to concatenate and/or compress.
             * Format is an array of objects with src (array of source js files)
             * and dest (destination) keys.
             */
            files: [{
                src: [
                  'assets/js/main.js',
                  'assets/js/components/*.js'
                ],
                dest: 'source/assets/js/main.js'
            }],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the js task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/js/**/*.js', 'test/**/*.spec.js'],
            /*
             * Any files and folders to delete prior to the build task running.
             * Delete this if you don't want to run the clean step before generating the fresh files.
             */
            clean: ['source/assets/js'],
            /*
             * JSHint settings
             * Using this is recommended - a sensible set of defaults have been
             * picked to help avoid common issues. Delete or set to false to disable.
             * To override defaults set them in the 'options' object. Available options
             * can be found here: http://www.jshint.com/docs/options
             */
            hint: {
                files: ['assets/js/main.js'],
                options: {
                    jshintrc: true,
                    globals: {
                        jQuery: true
                    }
                }
            },
            /*
             * JS code style checker.
             * Currently set to load in an external config file, .jscsrc
             */
            jscs: {
                files: ['assets/js/**/*.js', 'test/**/*.spec.js'],
                options: {
                    config: true
                }
            },
            /*
             * Jasmine settings
             * Default settings are to check all JS files in the assets folder and test against
             * all specs in the test folder. Spec for example file, testfilejs, is named testfile.spec.js
             */
            test: {
                src: ['assets/js/**/*.js'],
                specs: ['test/**/*.spec.js']
            }
        },

        /******************************************************************************
         * Font handling task
         * Currently just copies over specified font files into the public directory
         ******************************************************************************/

        fonts: {
            /*
             * The source directory.
             * Source and destination paths will be taken/generated relative to this.
             */
            src: 'assets/fonts',
            /*
             * Target destination directory.
             */
            dest: 'source/assets/fonts',
            /*
             * Font files to copy to 'dest'
             */
            copy: ['**/*.{eot,ttf,woff,woff2,css}'],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the css task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/fonts/**/*.{eot,ttf,woff,woff2,css}']
        },

        /******************************************************************************
         * Testing
         * Not sure what config needs setting here just yet.
         ******************************************************************************/

        test: {

        }
    };

    /************************** NO NEED TO EDIT BELOW THIS LINE **************************/

    require('jit-grunt')(grunt, {
        'cssmetrics': 'grunt-css-metrics',
        'sass': 'grunt-sass'
    });

    let env = (function(){
        if ( grunt.option('dev') ) {
            return 'dev';
        } else if ( grunt.option('release') ) {
            return 'release';
        }
        return 'dist';
    })();

    grunt.initConfig({
        env: env,
        pkg: grunt.file.readJSON('package.json'),
        clean: {},
        watch: {
            options: {
                livereload: false
            },
            allcss: {
                files: ['assets/sass/**/*.scss', 'assets/sass/patterns/**/*.scss'],
                tasks: ['sass_globbing', 'css'],
                options: {},
            },
        },
        sass_globbing: {
            build: {
                files: {
                   'assets/sass/_patterns.scss': 'assets/sass/patterns/**/*.scss',
                }
            }
        },
        tasks: config,
        concurrent: {
            first: ['css', 'scripts', 'images', 'fonts']
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['sass_globbing', 'concurrent:first']);

};
