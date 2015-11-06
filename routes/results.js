'use strict';

var express = require('express'),
  router = express.Router(),
  fs = require('fs'),
  conf = require('../config'),
  output = conf.get('rules'),
  res = fs.readFileSync(output),
  rules = res && res.length ? JSON.parse(res) : false;

function getValue(object) {
  var product = Object.keys(object)[0],
    result = object[product],
    value = 0,
    productName;

  productName = rules.alias[product];

  if (productName) {
    value = rules.norms[productName];
  }

  return {
    norm: value && value.m || 0,
    name: product.split(',')[0],
    value: result
  };
}

function getResults(listResults) {
  var result = [],
    maxIndex = listResults.length,
    i = 0,
    value, min, max,
    tolerance, info, norm, description, dif;

  for (; i < maxIndex; i++) {
    console.log(i);
    info = getValue(listResults[i]);
    norm = info.norm;
    value = info.value;
    tolerance = norm * rules.tolerance / 100;
    min = norm - tolerance;
    max = norm + tolerance;

    description = norm ? 'соответствует норме' : 'для этого продукта не найдены соответствия';

    if (value > max && norm) {
      dif = value * 100 / max - 100;
      description = 'избыток на ' + Math.round(dif) + '%';
    }

    if (value < min) {
      dif = 100 - value * 100 / min;
      description = 'недостаток ' + (value === 0 ? 100 : Math.round(dif)) + '%';
    }

    result.push(info.name + ': ' + description);
  }

  return result;
}

/* Process food result. */
router.post('/', function (req, res) {
  console.log('-----request------');
  res.json(getResults(req.body));
});

module.exports = router;
