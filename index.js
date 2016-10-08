
var pkg = require('./package.json');

var VERSION = '1.0.0' || pkg.version;

module.exports = require('./pjs-production/'+ VERSION +'/particleground.all');