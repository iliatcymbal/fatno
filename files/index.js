'use strict';

var fs = require('fs'),
  conf = require('../config'),
  output = conf.get('products');

function getProds() {
  var res = fs.readFileSync(output);

  return res && res.length ? JSON.parse(res) : false;
}

module.exports = getProds();
