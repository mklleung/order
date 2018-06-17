var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('completedOrders', { title: 'Completed Orders' });
});

module.exports = router;
