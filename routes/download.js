var express = require('express');
var router = express.Router();
var menuData = require('./com-header-menu-data');

router.get('/', function(req, res, next) {
    res.render('download', {
        menuData: menuData,
        title: '下载Particleground.js',
        nav: 2
    });
});

module.exports = router;
