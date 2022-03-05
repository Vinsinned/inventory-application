//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var catalogueSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: {type: String}
});

// Virtual for this book instance URL.
itemSchema
.virtual('url')
.get(function () {
  return '/catalog/book/'+this._id;
});

// Export model.
module.exports = mongoose.model('Category', categorySchema);