/**
 * Created by Knarfux on 29/04/2016.
 */

module.exports = function(grunt){
    grunt.initConfig({
        ngsrc: {
            target: {
                cwd: 'app/',
                src: ['../bower_components/angular/angular.js', 'factories/*.js', 'controllers/*.js','views/**/*.js'],
                dest: ['app/index.html']
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'app/views/', src: 'index.html', dest: 'app/'}
                ]
            }
        },
        watch: {
            options:{
                livereload: true,
                atBegin: true
            },
            files:[
                'app/css/*.less',
                'app/views/**/*.html',
                'app/controllers/*.js',
                'app/*.html',
                'Gruntfile.js'
            ],
            tasks: ['copy', 'less', 'ngsrc']
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
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dev', ['watch']);
};