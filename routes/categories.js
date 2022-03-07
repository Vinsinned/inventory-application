var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController')

/* GET home page. */
router.get('/', category_controller.categories_list);

module.exports = router;