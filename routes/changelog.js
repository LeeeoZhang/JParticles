var express = require('express');
var router = express.Router();
var changelog = require('../db/changelog');
var menuData = require('./com-header-menu-data');

router.get('/', function(req, res, next) {
    res.render('changelog', {
        changelog: changelog,
        menuData: menuData,
        title: 'Particleground.js更新日志',
        nav: 3
    });
});

module.exports = router;
