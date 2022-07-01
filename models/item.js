var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

ItemSchema.virtual('url').get(function () {
  return '/emporium/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
