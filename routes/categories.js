var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController')

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/item'); 
});

module.exports = router;