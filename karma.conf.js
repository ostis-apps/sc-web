// Karma configuration
// Generated on Sun Jul 09 2017 08:29:51 GMT+0300 (+03)

module.exports = function (config) {
    config.set({

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-sourcemap-loader'
        ],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // ... normal karma configuration
        files: [
            {pattern: 'client/static/common/jquery/jquery-2.1.3.js', watched: false},
            {pattern: 'client/static/common/jquery/jquery.namespace.js', watched: false},
            {pattern: './build/concat.js', watched: false},
            {pattern: 'client/js/Ui/*.spec.js', watched: false},
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'client/js/Ui/*.spec.js': ['webpack', 'sourcemap'],
            'client/js/Ui/*.js': ['sourcemap'],
        },

        webpack: {
            // karma watches the test entry points
            // (you don't need to specify the entry option)
            // webpack watches dependencies

            // webpack configuration
            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
