var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController')

/* GET home page. */
router.get('/', category_controller.categories_list);

/* GET list page. */
router.get('/:id', category_controller.category_detail);

module.exports = router;