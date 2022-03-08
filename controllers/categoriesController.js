var Item = require('../models/items');
var Category = require('../models/category');
var async = require('async');

const { body, validationResult } = require("express-validator");
const items = require('../models/items');

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
			Item.find({ 'category': req.params.id })
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
		res.render('category_detail', { title: results.category.name, items: results.category, category_items: results.category_items } );
	});

};

exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create Category' });
};

exports.create_post_get = [

    // Validate and sanitize fields.
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Category name must be specified.')
		.isAlphanumeric().withMessage('Category name has non-alphanumeric characters.'),
		body('description').trim().isLength({ min: 1 }).escape().withMessage('Category name must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Author object with escaped and trimmed data
        var category = new Category(
            {
                name: req.body.name,
								description: req.body.description
					}
				);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('category_form', { title: 'Create Category', category: category, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            category.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(category.url);
            });
        }
    }
];
