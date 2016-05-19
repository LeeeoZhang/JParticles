var express = require('express');
var router = express.Router();

var examplesInfo = require('../db/examples-info');
console.log('in');

router.get('/', function(req, res, next) {
    // req.originalUrl: /examples/test
    var name = req.originalUrl.substring(10);
    var info = examplesInfo[ name ];
    if( info ){
        res.render( 'examples/'+ name + '.html',  info );
    }else{
        //not found
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

module.exports = router;
