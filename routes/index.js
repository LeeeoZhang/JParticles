var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Particleground.js 简洁，高效，轻量级的纯js粒子运动特效插件。',
        nav: 0
    });
});

module.exports = router;
