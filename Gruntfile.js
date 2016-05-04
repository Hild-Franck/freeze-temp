/**
 * Created by Knarfux on 29/04/2016.
 */

module.exports = function(grunt){
    grunt.initConfig({
        ngsrc: {
            target: {
                src: ['app/controllers/*.js','app/views/**/*.js'],
                dest: ['app/index.html']
            }
        },
        watch: {
            options:{
                livereload: true,
                atBegin: true
            },
            files:[
                'app/css/*.less',
                'app/views/*.html',
                'app/*.html'
            ],
            tasks: ['less', 'ngsrc']
        },
        less: {
            development: {
                files: {
                    'app/css/style.css': 'app/css/style.less'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-ngsrc');

    grunt.registerTask('dev', ['watch']);
};