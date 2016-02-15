/*
 *  JS concatenation and compression task
 */
module.exports = function(grunt) {

    var _ = require('lodash');

    if ( grunt.config('tasks.scripts') ) {

        var uglifyTargets = {};

        _.each(grunt.config('tasks.scripts.files'), function(obj){
            uglifyTargets[obj.dest] = obj.src;           
        });

        if ( grunt.config('tasks.scripts.hint') ) {
            grunt.config('jshint', {
                options: {
                    reporter: require('jshint-stylish'),
                    curly: true,
                    eqeqeq: true,
                    eqnull: true,
                    browser: true,
                    forin: true,
                    nonbsp: true,
                    undef: true,
                    jquery: true
                },
                dist: {
                    options: {
                        devel: false
                    },
                    src: grunt.config('tasks.scripts.hint.files')
                },
                dev: {
                    options: {
                        devel: true,
                    },
                    src: grunt.config('tasks.scripts.hint.files')
                }
            });

            if ( _.isObject(grunt.config('tasks.scripts.hint.options')) ) {
                grunt.config('jshint.dist.options', _.merge(grunt.config('jshint.dist.options'), grunt.config('tasks.scripts.hint.options')) );
            }
        } else {
            grunt.registerTask('jshint:dist', []);
            grunt.registerTask('jshint:dev', []);
        }

        grunt.config('uglify', {
            dist: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: true
                    }
                },
                files: uglifyTargets
            },
            dev: {
                options: {
                    sourceMap: true,
                    compress: false
                },
                files: uglifyTargets
            }
        });
        
        if ( grunt.config('tasks.scripts.clean') ) {
            grunt.config('clean.scripts', grunt.config('tasks.scripts.clean'));    
        } else {
            grunt.config('clean.scripts', []);
        }
        
        grunt.registerTask('scripts:dist', ['jshint:dist', 'clean:scripts', 'uglify:dist']);
        grunt.registerTask('scripts:dev', ['jshint:dev', 'clean:scripts', 'uglify:dev']);
        grunt.registerTask('scripts:release', ['scripts:dist']);

    } else {

        grunt.registerTask('scripts:dist', []);
        grunt.registerTask('scripts:dev', []);
        grunt.registerTask('scripts:release', []);

    }

    grunt.registerTask('scripts', ['scripts:' + grunt.config('env')]);

    if ( grunt.config('tasks.scripts.watch') ) {
        grunt.config('watch.scripts', {
            files: grunt.config('tasks.scripts.watch'),
            tasks: ['scripts']
        });
    }

};