/*
 *  Set up the CSS tasks
 *  Preprocess Sass and then generate vendor prefixes with autoprefixer (for distuction)
 */
module.exports = function(grunt) {

    var _ = require('lodash');

    if ( grunt.config('tasks.css') ) {

        var sassTargets = {};
        var concatTargets = {};
        var autoprefixTargets = [];
        var tempCounter = 0;

        _.each(grunt.config('tasks.css.files'), function(obj){
            var concatTarget = {};
            concatTargets[obj.dest] = [];
            if ( _.isArray(obj.src) ) {
                _.each(obj.src, function(item, i){
                    var tempName = '.tmpcss/' + tempCounter + '.css';
                    concatTargets[obj.dest].push(tempName);
                    sassTargets[tempName] = item;
                    tempCounter++;
                });
            } else {
                var tempName = '.tmpcss/' + tempCounter + '.css';
                sassTargets[tempName] = obj.src;
                concatTargets[obj.dest].push(tempName);
                tempCounter++;
            }
        });

        _.each(grunt.config('tasks.css.files'), function(obj){
            autoprefixTargets.push(obj.dest);
        });

        grunt.config('sass', {
            dist: {
                options: {
                    // outputStyle: 'compressed',
                    sourceMap: false
                },
                files: sassTargets
            },
            dev: {
                options: {
                    outputStyle: 'expanded',
                    sourceMap: true
                },
                files: sassTargets
            }
        });

        grunt.config('concat.css', {
            files: concatTargets
        });

        grunt.config('postcss', {
            dist: {
                options: {
                    map: false,
                    processors: [
                        require('autoprefixer')({
                            browsers: grunt.config('tasks.css.autoprefix')
                        })
                    ]
                },
                src: autoprefixTargets
            },
            dev: {
                options: {
                    map: false,
                    processors: [
                        require('stylelint')(),
                        require('postcss-reporter')({
                          clearMessages: true,
                          throwError: true
                        }),
                    ],
                    syntax: require('postcss-scss')
                },
                writeDest: false,
                src: grunt.config('tasks.css.watch')
            }
        });

        grunt.config('cssmetrics', {
            dist: {
                src: autoprefixTargets
            }
        });

        grunt.config('clean.csstmp', ['.tmpcss']);

        if ( grunt.config('tasks.css.clean') ) {
            grunt.config('clean.css', grunt.config('tasks.css.clean'));
        } else {
            grunt.config('clean.css', []);
        }

        grunt.registerTask('css:dist', ['clean:css', 'sass:dist', 'concat:css', 'clean:csstmp', 'postcss:dist', 'cssmetrics']);
        grunt.registerTask('css:dev', ['clean:css', 'sass:dev', 'concat:css', 'clean:csstmp', 'postcss:dev']);
        grunt.registerTask('css:release', ['css:dist']);

    } else {

        grunt.registerTask('css:dist', []);
        grunt.registerTask('css:dev', []);
        grunt.registerTask('css:release', []);

    }

    grunt.registerTask('css', ['css:' + grunt.config('env')]);

    if ( grunt.config('tasks.css.watch') ) {
        grunt.config('watch.css', {
            files: grunt.config('tasks.css.watch'),
            tasks: ['css']
        });
    }

};
