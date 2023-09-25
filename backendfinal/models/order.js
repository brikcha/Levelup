const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

    // required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
   
    price: {
      type: Number,
    //   required: true
    }
  }],
  shippingAddress: {
    type: String,
    // required: true
  },
  paymentMethod: {
    type: String,
    enum:["paypal","payOnDelivery"]
    // required: true
  },
  phoneNumber: {
    type: Number,
    // required: true
  },
  paymentResult: {
    id: {
      type: String
    },
    status: {
      type: String
    },
    update_time: {
      type: String
    },
    email_address: {
      type: String
    }
  },
  taxPrice: {
    type: Number,
    // required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    // required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    // required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    // required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    // required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
