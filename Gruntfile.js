module.exports = function (grunt)
{
    grunt.initConfig({
        watch: {
            options: {
                livereload: true
            },
            files: [
                    'app/css/*.less',
                    'app/views/*.html',
                    'app/*.html'
                ],
            tasks: ['less']
        },

        less: {
            development: {
                options: {
                    path: ['app/css']
                },
                files: {
                    "app/css/style.css": 'app/css/style.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('dev', ['watch']);
};