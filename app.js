;(function () {
    'use strict';

    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var multer  = require('multer');
    var ECT = require('ect');
    var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.html' });

    var routes = require('./routes/index');
    var results = require('./routes/results');
    var products = require('./routes/products');

    var app = express();

    app.set('view engine', '.html');
    app.engine('.html', ectRenderer.render);

    /* TODO: uncomment after placing your favicon in /public
    app.use(favicon(__dirname + '/public/favicon.ico'));*/
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(multer({
        dest: './public/files/',
        onFileUploadStart: function (file) {
            console.log(file.fieldname + ' is starting ...');
        }
    }));

    app.use(function(req, res, next) {
        console.log('method', req.method);
        if (false) {//req.method === 'POST' || req.method === 'OPTIONS') {

            res.header('Access-Control-Allow-Origin', 'http://fiddle.jshell.net');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.send('some');
            console.log('methodIns');
            res.end();

        } else {
            next();
        }
    });

    app.use('/', routes);
    app.use('/products', products);
    app.use('/results', results);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                test: 'test'
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            test: 'test'
        });
    });


    module.exports = app;

}());