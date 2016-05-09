var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('choice/index', { title: 'Menu | Zapp' });
});

router.get('/suggestion', function(req, res, next){
  res.render('choice/suggestion',{ title: 'Suggestion | Zapp' });
});

router.get('/route', function(req, res, next){
  res.render('choice/route',{ title: 'Route | Zapp' });
});

router.get('/directions', function(req, res, next){
  res.render('choice/directions',{ title: 'Directions | Zapp' });
});

router.get('/destination', function(req, res, next){
  res.render('choice/destination',{ title: 'Destination | Zapp' });
});

router.get('/outofoptions', function(req, res, next){
	res.render('choice/outofoptions', {title: 'Out of options | Zapp'});
});

module.exports = router;