var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController')

/* GET home page. */
router.get('/', category_controller.categories_list);

/* GET create page. */
router.get('/create', category_controller.category_create_get);

// POST request for creating category.
router.post('/create', category_controller.create_post_get);

// GET request for creating category.
router.get('/:id/update', category_controller.category_update_get);

// POST request for creating category.
router.post('/:id/update', category_controller.category_update_post);

// GET request for deleting category.
router.get('/:id/delete', category_controller.category_delete_get);

// POST request for deleting category.
router.post('/:id/delete', category_controller.category_delete_post);

/* GET create page. */
router.get('/:id', category_controller.category_detail);

module.exports = router;