var configuration = require('../config'),
    paths = configuration.get('paths');

module.exports = function (config) {
    config.set({
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            'public/' + paths.libraries + '/*.js',
            paths.scriptsAbs + '/' + configuration.get('mainScript'),
            paths.testsHelpers + '/*.js',
            paths.specs + '/*.js'
        ],

        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 6000,
        singleRun: false,

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG
    });
};