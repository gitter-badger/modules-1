// Karma configuration file
//
// For all available config options and default values, see:
// https://github.com/karma-runner/karma/blob/stable/lib/config.js#L54

module.exports = function (config) {
  'use strict';

  var hAzzleModules = [
      'https://raw.githubusercontent.com/hazzlejs/hAzzleJS/master/core/hazzle.js',
      'https://raw.githubusercontent.com/hazzlejs/hAzzleJS/master/core/types.js',
      'https://raw.githubusercontent.com/hazzlejs/hAzzleJS/master/core/core.js',
      'https://raw.githubusercontent.com/hazzlejs/hAzzleJS/master/core/util.js'
      //modules
    ],
    hAzzleModulesTests = [
      'test/cookie.js',
      'test/json.js',
      'test/outerhtml.js',
      'test/password.js',
      'test/timeago.js'
    ];

  var files = ['bower_components/chai/chai.js']
    .concat(hAzzleModules)
    .concat(hAzzleModulesTests);

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: [
      'mocha'
    ],

    // list of files / patterns to load in the browser
    files: files,

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress', 'junit', 'teamcity'
    // CLI --reporters progress
    reporters: ['dots'],

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // start these browsers
    // CLI --browsers Chrome,Firefox,Safari
    browsers: [
      'PhantomJS'
    ],

    // if browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 20000,

    // auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    plugins: [
      'karma-mocha',
      'karma-requirejs',
      'karma-phantomjs-launcher'
    ]
  });
};
