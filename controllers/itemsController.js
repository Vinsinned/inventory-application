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

// Display detail page for a specific Genre.
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