var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController')

/* GET home page. */
router.get('/', category_controller.categories_list);

/* GET create page. */
router.get('/create', category_controller.category_create_get);

// POST request for creating category.
router.post('/create', category_controller.create_post_get);

/* GET create page. */
router.get('/:id', category_controller.category_detail);

module.exports = router;