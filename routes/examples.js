var express = require('express');
var router = express.Router();

var examplesInfo = require('../db/examples');
var preface = examplesInfo.preface;
var list = examplesInfo.list;

var menuData = require('./com-header-menu-data');

router.get('/', function(req, res, next) {
    // req.originalUrl: /examples/test
    var name = req.originalUrl.substring(10);
    var info = preface[ name ] || list[ name ];
    if( info ){
        var output = {
            preface: preface,
            list: list,
            menuData: menuData,
            title: info.title,
            pageName: name,
            nav: 1
        };
        //console.log( output )
        res.render( 'examples/'+ name + '.html', output );
    }else{
        //not found
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

module.exports = router;
