// Karma configuration
// Generated on Wed Nov 18 2015 02:11:57 GMT-0800 (Pacific Standard Time)
// Thanks to Tim Evko for the tutorial on how to set up!
// http://www.sitepoint.com/testing-javascript-jasmine-travis-karma/

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery','jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/www/js/jquery/*.js',
      'client/www/js/serverInteractions/*.js',
      'client/www/js/osInteractions/*.js',
      'client/www/js/user/*.js',
      'client/www/js/*.js',
      'test/javascripts/helpers/jasmine-jquery.js',
      'test/javascripts/fixtures/*.html',
      'test/javascripts/helpers/preloadFixtures.js',
      'test/javascripts/helpers/mock-ajax.js',
      'test/test_responses/*.js',
      'test/*.js'

    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**.*.html': [],
      'client/www/js/*.js': ['coverage'],
      'client/www/js/serverInteractions/*.js': ['coverage'],
      'client/www/js/user/login-controller.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['html', 'coverage'],
    
    coverageReporter: {
      type: 'html',
      dir : 'coverage/',
      subdir : 'report/'
      //file : 'coverage.txt'
    },


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
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
