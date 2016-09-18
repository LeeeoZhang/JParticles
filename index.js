
var pkg = require('./package.json');

var VERSION = pkg.version;

module.exports = require('./pjs-production/'+ VERSION +'/particleground.all');