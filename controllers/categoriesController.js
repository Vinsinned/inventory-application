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
		res.render('category_detail', { title: results.category.name, category: results.category, category_items: results.category_items } );
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

// Display category update form on GET.
exports.category_update_get = function (req, res, next) { 
	Category.findById(req.params.id, function(err, category) {
        if (err) { return next(err); }
        if (category==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('category_form', { title: 'Update Category', category: category });
    });
}

// Handle Genre update on POST.
exports.category_update_post = [
   
    // Validate and sanitze the name field.
		body('name', 'Category name must contain at least 1 characters').trim().isLength({ min: 1 }).escape(),
		body('description', 'Category description must contain at least 1 characters').trim().isLength({ min: 1 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var category = new Category(
          {
          	name: req.body.name,
						description: req.params.description,
						_id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('category_form', { title: 'Update Category', category: category, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err,category) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect(category.url);
                });
        }
    }
];

// Display Category delete form on GET.
exports.category_delete_get = function (req, res, next) {

	async.parallel({
		category: function (callback) {
			Category.findById(req.params.id).exec(callback);
		},
		items: function (callback) {
			Item.find({ 'category': req.params.id }).exec(callback);
		},
	}, function (err, results) {
		 	if (err) { return next(err); }
			if (results.category==null) { // No results.
					res.redirect('/catalog/genres');
			}
			// Successful, so render.
		res.render('category_delete', { title: 'Delete Category', category: results.category, items: results.items } );
	});

};

// Handle book delete on POST.
exports.category_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).
	
		async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        items: function(callback) {
            Item.find({ 'category': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.items.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('category_delete', { title: 'Delete Genre', category: results.category, items: results.items } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Category.findByIdAndRemove(req.body.id, function deleteCategory(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/category');
            });

        }
    });

};