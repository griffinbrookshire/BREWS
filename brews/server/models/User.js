const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedBeers: [
    {
      beer: {
        type: Schema.Types.ObjectId,
        ref: 'beer',
      },
    },
  ],
  likedBreweries: [
    {
      brewery: {
        type: Schema.Types.ObjectId,
        ref: 'brewery',
      },
    },
  ],
});

module.exports = User = mongoose.model('user', UserSchema);
