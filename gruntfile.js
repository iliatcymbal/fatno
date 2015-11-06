;(function () {
    'use strict';

    var config = require('./config'),
        paths = config.get('paths'),
        src = paths.scriptsAbs + paths.scriptsDev + '/*.js',
        dest = paths.scriptsAbs + '/' + config.get('mainScript'),
        pathToLibs = paths.libraries,
        plugins = config.get('plugins'),
        testsHelpers = config.get('testLibs'),
        copyList = [],
        getObject = function (element, destUrl) {
            return {
                expand: true,
                flatten: true,
                src: ['bower_components/*/' + element + '.js', 'bower_components/*/dist/' + element + '.js'],
                dest: destUrl ? destUrl : 'public/' + pathToLibs,
                filter: 'isFile'
            };
        };

// copy plugins for pages into the public directory
    plugins.forEach(function (element) {
        copyList.push(getObject(element));
    });

// copy test helpers into the test directory
    testsHelpers.forEach(function (element) {
        copyList.push(getObject(element, config.get('paths').testsHelpers));
    });

    module.exports = function (grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            concat: {
                options: {
                    stripBanners: true,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                dist: {
                    src: [src],
                    dest: dest
                }
            },

            copy: {
                main: {
                    files: copyList
                }
            },

            watch: {
                scripts: {
                    files: ['public/scripts/*.js']
                }
            },

            karma: {
                unit: {
                    options: {
                        configFile: 'tests/karma.config.js'
                    }
                }
            },

            jshint: {
                all: [src, paths.specs + '/*.js']
            },

            jscs: {
                src: [src, paths.specs + '/*.js'],
                options: {
                    config: '.jscsrc'
                }
            }
        });

        grunt.event.on('watch', function (action, filepath, target) {
            console.log(target + ': ' + filepath + ' has ' + action);
        });

        require('load-grunt-tasks')(grunt);

        grunt.registerTask('build', ['copy', 'concat']);
        grunt.registerTask('tests', ['concat', 'jscs', 'jshint', 'karma']);

    };
}());
