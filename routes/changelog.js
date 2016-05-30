var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('changelog', {
        title: 'Particleground.js更新日志',
        nav: 3
    });
});

module.exports = router;
