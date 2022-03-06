var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoriesController');
var item_controller = require('../controllers/itemsController');

/* GET home page. */
router.get('/', item_controller.items_list);

module.exports = router;