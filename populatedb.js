#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/items')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

//item_name, item_description, item_category, item_price, item_quantity
function itemsCreate(item_name, item_description, item_category, item_price, item_quantity, cb) {
    itemdetail = {
        name: item_name,
        description: item_description,
        category: item_category._id,
        price: item_price,
        quantity: item_quantity
    }
  
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

//add description over here
function categoryCreate(category, description, cb) {
  var category1 = new Category({ name: category, description: description });
       
  category1.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category1);
    categories.push(category1)
    cb(null, category1);
  }   );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Books', 'For the intellectuals', callback);
        },
        function(callback) {
          categoryCreate('Technology', 'For the savvy', callback);
        },
        function(callback) {
          categoryCreate("Beauty", 'For the looks', callback);
        },
        function(callback) {
          categoryCreate('Fine Art', 'For the masterpieces', callback);
        },
        function(callback) {
          categoryCreate('Grocery', 'For the best thing in life', callback);
        },
        function(callback) {
          categoryCreate('Outdoors', 'For the adventurers', callback);
        },
        function(callback) {
          categoryCreate('Toys & Games', 'For the kids in us', callback)
        }
        ],
        // optional callback
        cb);
}

//item_name, item_description, item_category, item_price, item_quantity
function createItems(cb) {
    async.series([
        function(callback) {
            itemsCreate('The Odin Project', 'A course to help you become a full stack developer!',
            categories[0], 0, 100, callback);
        },
        function(callback) {
          itemsCreate('iPad Air 64GB', 'A great and reliable iPad from Apple', categories[1], 599.99, 10000, callback);
        },
        function(callback) {
            itemsCreate('iPhone 13 Pro Max', 'The most reliable and popular current generation phone',
                categories[1], 1099.00, 1000000, callback);
        },
        function(callback) {
            itemsCreate('Code: The Hidden Language of Computer Hardware', 'One of the best computer science courses known to man',
                categories[0], 16.89, 10000000, callback);
        },
        function(callback) {
          itemsCreate('Monopoly', 'The board game that never ends!', categories[6], 19.99, 100000000, callback);
        },
        function(callback) {
          itemsCreate('DIOR Savauge', 'The greatest cologne in history.', categories[2], 104.40, 100, callback);
        },
        function(callback) {
            itemsCreate('Godiva Chocolate Assortment', 'Fancy chocolates best for dates and hookups', categories[4],
                23.99, 192, callback);
        },
        function(callback) {
            itemsCreate('U.S. Authentic MRE', 'Great camping equipment or for U.S. miltary enthusiasts', categories[4],
                16.89, 10000, callback);
        },
        function(callback) {
            itemsCreate('The Persistence of Memory', 'One of Salvador Dali\'s most famous works', categories[3],
                15000000, 1, callback);
        },
        function(callback) {
            itemsCreate('Yvel Luxury Face Mask', 'The most expensive face mask ever', categories[2],
                1500000, 1, callback);
        },
        function(callback) {
            itemsCreate('Super Soaker CPS 2000', 'The strongest and most powerful water gun', categories[5],
                210.00, 25000000, callback);
        },
        function(callback) {
            itemsCreate('Dungeons & Dragons 5th Edition RPG: Starter Set', 'The beginning to your one true board game', categories[0],
                210.00, 25000000, callback);
        },
        function(callback) {
            itemsCreate('Bluefin Tuna', 'The real deal', categories[4],
                3100000, 1, callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('All is well.');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



