var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IteminstanceSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
});

module.exports = mongoose.model('Iteminstance', IteminstanceSchema);
