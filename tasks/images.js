/*
 *  Image handling task.
 *  Optimise images and/or copy to the public directory.
 */
module.exports = function(grunt) {

    if ( grunt.config('tasks.images') ) {
        
        grunt.config('imagemin', {
            dist: {
                options: {
                    optimizationLevel: grunt.config('tasks.images.optimizationLevel') || 3,
                },
                files: [{
                    expand: true,
                    cwd: grunt.config('tasks.images.src'),
                    src: grunt.config('tasks.images.optimise'),
                    dest: grunt.config('tasks.images.dest')
                }]
            }
        });

        grunt.config('copy.images', {
            files: [{
                expand: true,
                cwd: grunt.config('tasks.images.src'),
                src: grunt.config('tasks.images.copy'),
                dest: grunt.config('tasks.images.dest')
            }]
        });
        
        grunt.config('clean.images', grunt.config('tasks.images.dest'));    
        
        grunt.registerTask('images:dist', ['newer:imagemin:dist', 'newer:copy:images']);
        grunt.registerTask('images:dev', ['newer:imagemin:dist', 'newer:copy:images']);
        grunt.registerTask('images:release', ['clean:images', 'images:dist']);

    } else {

        grunt.registerTask('images:dist', []);
        grunt.registerTask('images:dev', []);
        grunt.registerTask('images:release', []);

    }

    grunt.registerTask('images', ['images:' + grunt.config('env')]);

    if ( grunt.config('tasks.images.watch') ) {
        grunt.config('watch.images', {
            files: grunt.config('tasks.images.watch'),
            tasks: ['images']
        });
    }

};