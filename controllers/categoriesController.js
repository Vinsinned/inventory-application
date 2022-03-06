var Item = require('../models/items');
var Category = require('../models/category');
var async = require('async');

const { body, validationResult } = require("express-validator");

exports.categories_list = function(req, res, next) {

	// Display list of all items
	Category.find()
	.sort([['name', 'ascending']])
	.exec(function (err, all_categories) {
		if (err) { return next(err); }
		// Successful, so render.
		res.render('categories_list', { title: 'Categories List', categories:  all_categories});
	});

};

// Display detail page for a specific Genre.
exports.category_detail = function(req, res, next) {

	async.parallel({
		category: function(callback) {

			Category.findById(req.params.id)
				.exec(callback);
		},

		category_items: function(callback) {
			Item.find({ 'Category': req.params.id })
			.exec(callback);
		},

		}, function(err, results) {
		if (err) { return next(err); }
		if (results.category==null) { // No results.
			var err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}
		// Successful, so render.
		res.render('category_detail', { title: 'Category Items', items: results.category, category_items: results.category_items } );
	});

};
