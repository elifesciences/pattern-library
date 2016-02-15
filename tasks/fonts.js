/*
 *  Set up the Font tasks
 */
module.exports = function(grunt) {

    var _ = require('lodash');

    if ( grunt.config('tasks.fonts') ) {
        
        grunt.config('copy.fonts', {
            files: [{
                expand: true,
                cwd: grunt.config('tasks.fonts.src'),
                src: grunt.config('tasks.fonts.copy'),
                dest: grunt.config('tasks.fonts.dest')
            }]
        });
        
        grunt.config('clean.fonts', grunt.config('tasks.fonts.dest'));    
        
        grunt.registerTask('fonts:dist', ['newer:copy:fonts']);
        grunt.registerTask('fonts:dev', ['newer:copy:fonts']);
        grunt.registerTask('fonts:release', ['clean:fonts', 'fonts:dist']);

    } else {

        grunt.registerTask('fonts:dist', []);
        grunt.registerTask('fonts:dev', []);
        grunt.registerTask('fonts:release', []);

    }

    grunt.registerTask('fonts', ['fonts:' + grunt.config('env')]);

    if ( grunt.config('tasks.fonts.watch') ) {
        grunt.config('watch.fonts', {
            files: grunt.config('tasks.fonts.watch'),
            tasks: ['fonts']
        });    
    }

};