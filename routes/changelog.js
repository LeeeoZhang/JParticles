var express = require('express');
var router = express.Router();
var changelog = require('../db/changelog');

router.get('/', function(req, res, next) {
    res.render('changelog', {
        title: 'Particleground.js更新日志',
        nav: 3,
        changelog: changelog
    });
});

module.exports = router;
