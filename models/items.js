//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
	category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
	price: { type: Number, required: true },
	quantity: { type: Number, required: true }
});

// Virtual for this book instance URL.
itemSchema
.virtual('url')
.get(function () {
  return '/item/'+this._id;
});

// Export model.
module.exports = mongoose.model('Item', itemSchema);