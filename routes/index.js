;(function () {
  'use strict';

  var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    router = express.Router(),
    prods = require('../files/'),
    config = require('../config'),
    paths = config.get('paths'),
    mainScript = config.get('paths').scripts + '/' + config.get('mainScript'),
  // Set js libraries variable for index.html template
    jsLibs = (function () {
      var path = config.get('paths').libraries;
      return config
        .get('plugins')
        .map(function (element) {
          return '<script src="' + path + '/' + element + '.js"></script>';
        });
    }()),
    mainJS = '<script src="' + mainScript + '"></script>',
  url, scripts;

  function getFiles (dir, files_){
    var files = fs.readdirSync(dir);

    files_ = files_ || [];

    for (var i in files){
      var name = dir + '/' + files[i];
      if (!fs.statSync(name).isDirectory()){
        files_.push(path.basename(name));
      }
    }
    return files_;
  }

  if (config.get('devMode')) {
    url = path.join(path.dirname(__dirname), paths.scriptsAbs, paths.scriptsDev);
    scripts = getFiles(url).map(function (value) {
      var script = '<script src="%src"></script>',
        src = path.join(paths.scripts, paths.scriptsDev, value);

      return script.replace('%src', src);
    });
    mainJS = scripts.join('');
  }

  /* GET home page. */
  router.get('/', function (req, res) {
    res.render('index', {
      title: 'Проверь рацион!',
      prods: prods || 'Error loading',
      libs: jsLibs.join(''),
      mainJS: mainJS,
      applicationName: config.get('applicationName')
    });
  });

  module.exports = router;

}());
