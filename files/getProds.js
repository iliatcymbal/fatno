var node_xj = require("xls-to-json"),
    fs = require('fs'),
    conf = require('../config'),
    output = conf.get('products'); // path to JSON file ith ingridients;

// read xls sheet with product
node_xj({
    input: './files/ingridients.xls',
    output: null,
    sheet: 'sheet'
}, function(err, result) {
    'use strict';

    var res = [],
        product, val, prop, stream;

    if(err) {
        console.error(err);
    } else {
        console.log('Total amount of products is ', result.length);

        stream = fs.createWriteStream(output, { flags : 'w' });

        // Process data from array of product objects
        for (var i = 0, max = result.length; i < max ; i++) {
            product = result[i];

            // write titles and length in the first array's item
            if (i === 0) {
                res.push({
                        titles: [],
                        length: result.length
                    }
                );
                for(var key in product) {
                    if (key !== 'Продукты') {
                        res[res.length-1].titles.push(key);
                    }
                }
            }

            res.push({
                    name: product['Продукты'],
                    values: []
                }
            );

            prop = res[res.length-1].values;

            // create object with name of product and it's ingridients
            for (var j in product) {
                val = product[j];
                val = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
                if (j !== 'Продукты') {
                    prop.push(val);
                }
            }
        }

        console.log(res);

        stream.write(JSON.stringify(res));
    }
});