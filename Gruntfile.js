/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                files: {
                    'staging/css/styles.css': ['css/*.css']
                }
            },
            js: {
                files: {
                    'staging/js/controllers/controller.js': ['js/controllers/*.js'],
                    'staging/js/common/constants.js': ['js/common/*.js'],
                    'staging/js/services/services.js': ['js/services/*.js'],
                    'staging/js/common.js': ["js/jquery.min.js",
                        "js/bootstrap.min.js",
                        "js/jquery-ui.min.js",
                        "js/angular.min.js",
                        "js/angular-route.min.js",
                        "js/ui-boostrap-0.9.0.min.js",
                        "js/angular-cookies.min.js",
                        "js/angular-locale_de-de.js",
                        "js/angular-translate.min.js",
                        "js/angular-translate-loader-static-files.min.js",
                        "js/loading-bar.min.js",
                        "js/jPushMenu.js",
                        "js/moment.min.js",
                        "js/fullcalendar.min.js",
                        "js/timepicker.js"],
                    'staging/js/apps.js':["js/myApp.js"],
                    'staging/js/login/services/services.js': ['js/login/services/*.js']

                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '/* SaiSoft Technologies, Pune*/'
                },
                files: {
                    'dist/css/style.min.css': ['staging/css/styles.css']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/controllers/controller.js': ['staging/js/controllers/controller.js'],
                    'dist/js/common/constants.js': ['staging/js/common/constants.js'],
                    'dist/js/services/services.js': ['staging/js/services/services.js'],
                    'dist/js/common.js': ['staging/js/common.js'],
                    'dist/js/apps.js': ['staging/js/apps.js'],
                    'dist/js/login/controllers/controller.js': ['js/login/controllers/loginController.js'],
                    'dist/js/login/common/constants.js': ['js/login/common/loginconstants.js'],
                    'dist/js/login/services/services.js': ['staging/js/login/services/services.js'],
                    'dist/js/login/app.js': ['js/login/loginapp.js']
                }
            }
        },
        minjson: {
            dist: {
                files: {
                    'dist/js/login/properties/Login_Messages_en.json': ['js/properties/Login_Messages_en.json'],
                    'dist/js/properties/locale-en.json': ['js/properties/locale-en.json'],
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                        expand: true,
                        cwd: 'angularviews',
                        src: '*.html',
                        dest: 'dist/angularviews'
                    },
                {
                        expand: true,
                        cwd: 'angularviews/navigation',
                        src: '*.html',
                        dest: 'dist/angularviews/navigation'
                    }]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                        expand: true,
                        cwd: 'img',
                        src: ['img/*.{png,jpg,gif}'],
                        dest: 'dist/img'
                    }]
            }
        },
        copy: {
            dist: {
                files: [
                    // includes files within path
                    {expand: true, src: ['font/*'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['css/images/*'], dest: 'dist', filter: 'isFile'},
                   {expand: true, src: ['img/wait.gif'], dest: 'dist', filter: 'isFile'}
                ],
            },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-minjson');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['concat:css', 'cssmin:dist', 'concat:js', 'uglify:dist', 'htmlmin:dist', 'imagemin:dist', 'minjson:dist', 'copy:dist']);
};
