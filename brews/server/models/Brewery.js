const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema({
  city: String,
  street: String,
  zip: String,
  number: String,
  coords: {
    lat: Number,
    lng: Number,
  },
});

const BrewerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  beers: [
    {
      beer: {
        type: Schema.Types.ObjectId,
        ref: 'beers',
      },
    },
  ],
});

module.exports = Brewery = mongoose.model('brewery', BrewerySchema);
