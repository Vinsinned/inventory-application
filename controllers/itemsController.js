var Item = require('../models/items');
var Category = require('../models/category');
var async = require('async');

const { body, validationResult } = require("express-validator");

exports.items_list = function(req, res, next) {

// Display list of all items
Item.find()
    .sort([['name', 'ascending']])
    .populate('category')
    .exec(function (err, all_items) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('items_list', { title: 'Items List', items:  all_items});
    });

};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {

    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item_info) {
        if (err) { return next(err); }
        // Successful, so render.
        console.log(item_info.name)
        res.render('item_detail', { title: item_info.name, item: item_info});
    });

};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {

    // Get all items, which we can use for adding to our book.
    Category.find()
        .sort([['name', 'ascending']])
        .exec(function (err, all_categories) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('item_form', { title: 'Create Item', categories: all_categories });
    });
};

// Handle item create on POST.
exports.item_create_post = [
    // Convert the item to an array.
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty.').trim().escape(),
    body('quantity', 'Quantity must not be empty').trim().escape(),
    body('category.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a item object with escaped and trimmed data.
        var item = new Item(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all categories for form.
            Category.find()
                .sort([['name', 'ascending']])
                .exec(function (err, results) {
                    if (err) { return next(err); }
                    // Mark our selected genres as checked.
                    for (let i = 0; i < results.category.length; i++) {
                        if (item.category.indexOf(results.category[i]._id) > -1) {
                            results.category[i].checked='true';
                        }
                    }
                    res.render('item_form', { title: 'Create Item', category:results.category, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            item.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new book record.
                   res.redirect(item.url);
                });
        }
    }
];