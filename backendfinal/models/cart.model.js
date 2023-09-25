const { number } = require('joi');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    name: String,
    price: Number,
    image:String,
  }],
  createdAt: { type: Date, default: Date.now },
  total: {
    type: Number,
    // required: true
  },  });

module.exports = mongoose.model('Cart', cartSchema);