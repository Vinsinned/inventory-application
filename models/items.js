//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
	category: { type: Schema.objectId, ref: 'Category' },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
	url: {type: String, required: true}
});

// Virtual for this book instance URL.
itemSchema
.virtual('url')
.get(function () {
  return '/catalog/book/'+this._id;
});

// Export model.
module.exports = mongoose.model('Item', itemSchema);