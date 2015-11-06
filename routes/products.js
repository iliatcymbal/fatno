var express = require('express');
var router = express.Router();
var prods = require('../files/');

console.log('Total products - ' + prods.length);

/* GET products with ajax request */
router.get('/', function(req, res) {
    res.json(prods);
});

module.exports = router;
