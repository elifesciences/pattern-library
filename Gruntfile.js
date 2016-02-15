module.exports = function(grunt) {

    /*
     * Task configuration
     *
     * These are the settings for the tasks defined in the /tasks directory.
     * Reasonable defaults have been set but edit as required for your project.
     *
     * To prevent a task from running completely, you can
     * delete (or comment out) the appropriate configuration block for that task.
     */
    var config = {

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
            autoprefix: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the css task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/sass/**/*.scss'],
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
            copy: ['**/*.svg'],
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
                src: ['assets/js/main.js'],
                dest: 'source/assets/js/main.js'
            }],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the js task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/js/**/*.js'],
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
                files: [],
                options: {
                    globals: {
                        jQuery: true
                    }
                }
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
            copy: ['**/*.{eot,ttf,woff,woff2}'],
            /*
             * Which files to watch for changes.
             * Changes to any files specified here will result in the css task being
             * re-run (when using grunt watch). Delete to disable watch for this task.
             */
            watch: ['assets/fonts/**/*.{eot,ttf,woff,woff2}']
        }

    };

    /************************** NO NEED TO EDIT BELOW THIS LINE **************************/

    require('jit-grunt')(grunt, {
        'cssmetrics': 'grunt-css-metrics',
        'sass': 'grunt-sass'
    });

    var env = (function(){
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
            }
        },
        tasks: config,
        concurrent: {
            first: ['css', 'scripts', 'images', 'fonts']
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['concurrent:first']);

};
