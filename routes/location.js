var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('location/index', { title: 'Current location | Zapp' });
});

module.exports = router;