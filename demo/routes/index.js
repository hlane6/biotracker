var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Video', videoTitle: 'Ants' });
});

router.post('/save', function(req, res, next) {
    res.set( {
        'Content-Disposition': 'attachment; filename=corrections.csv',
        'Content-Type': 'text/csv'
    });
    res.send(req.body.corrections);
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', { title: 'Welcome' });
});

module.exports = router;
