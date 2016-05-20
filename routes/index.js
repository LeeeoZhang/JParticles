var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Particleground.js 简单，简洁，高效的粒子背景运动插件。',
        nav: 0
    });
});

module.exports = router;
