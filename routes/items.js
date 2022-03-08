var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController');
var item_controller = require('../controllers/itemsController');

/* GET home page. */
router.get('/', item_controller.items_list);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/create', item_controller.item_create_get);

// POST request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.post('/create', item_controller.item_create_post);

/* GET list page. */
router.get('/:id', item_controller.item_detail);

module.exports = router;