/**
 * Created by Knarfux on 29/04/2016.
 */

module.exports = function(grunt){
    grunt.initConfig({
        ngsrc: {
            target: {
                options: {
                    moduleDiscriminator: 'bower_components/**/*.js'
                },
                cwd: 'app/',
                src: [
                    './app.js',
                    'factories/*.js',
                    'views/**/*.js',
                    'controllers/**/*.js'
                ],
                dest: ['app/index.html']
            },
            modules: {
                options:  {
                    placeholder: "<!-- ngsrcmodules -->"
                },
                cwd: 'app/',
                src: [
                    '../node_modules/socket.io-client/socket.io.js',
                    '../bower_components/angular-socket-io/socket.js',
                    '../bower_components/Chart.js/Chart.js',
                    '../bower_components/angular-chart.js/angular-chart.js'
                ],
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
                'app/*js',
                'Gruntfile.js'
            ],
            tasks: ['copy', 'less', 'ngsrc:modules', 'ngsrc:target']
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