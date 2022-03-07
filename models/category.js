//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

// Virtual for this book instance URL.
categorySchema
.virtual('url')
.get(function () {
  return '/category/'+this._id;
});

// Export model.
module.exports = mongoose.model('Category', categorySchema);