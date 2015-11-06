var debug = require('debug')('site');
var app = require('../app');
var conf = require('../config');

app.set('port', conf.get('port'));

console.log(conf.get('port'))

var server = app.listen(conf.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});