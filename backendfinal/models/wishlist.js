const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import the Product model
const Product = require('./product');

const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product' // Reference the Product model
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
