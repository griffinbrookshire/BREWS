const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BeerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  attributes: [String],
  brewery: {
    type: Schema.Types.ObjectId,
    ref: 'breweries',
  },
});

module.exports = Beer = mongoose.model('beer', BeerSchema);
