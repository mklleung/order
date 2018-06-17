var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('logIn', { title: 'Log In' });
});

module.exports = router;
