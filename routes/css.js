var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.locals = {}
    res.render('css');
});

router.get('/button', function(req, res) {
    res.locals = {}
    res.render('button');
});


module.exports = router;
