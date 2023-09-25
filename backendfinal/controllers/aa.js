const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const Cart =require('../models/cart.model')
const Product =require('../models/product')

const User=require('../models/user')


const CreateOrder = async function(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "Authorization header missing" });
        }
      
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
      
        try {
          // Find the user's cart
          const cart = await Cart.findOne({ userId: userId });
      
          if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
      
          // Calculate the total price of the order
          const totalPrice = cart.items.reduce((total, item) => {
            return total + item.quantity * item.price;
          }, 0);
      
          // Create a new order
          const order = new Order({
            user: userId,
            products: cart.items.map(item => {
              return {
                product: item.productId,
                quantity: item.quantity,
                price: item.price
              }
            }),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            // taxPrice: req.body.taxPrice || 0.0,
            // shippingPrice: req.body.shippingPrice || 0.0,
            totalPrice: totalPrice,
            // isPaid: req.body.isPaid || false,
            // paidAt: req.body.paidAt || null,
            // isDelivered: req.body.isDelivered || false,
            // deliveredAt: req.body.deliveredAt || null
          });
      
          const savedOrder = await order.save();
          res.json({ message: 'Order created', order: savedOrder });
      
        } catch (error) {
          res.status(500).json({ message: 'Unable to create order', error: error });
        }
      }
      
  
  

      const   getAllOrders = async function(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "Authorization header missing" });
        }
      
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
      
        try {
          const orders = await Order.find({ user: userId });
          res.json({ orders: orders });
      
        } catch (error) {
          res.status(500).json({ message: 'Unable to retrieve orders', error: error });
        }
      }
      

const getOrderById = async function(req, res) {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    // res.json({orderId})
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order: order });
  } catch (error) {
    res.status(500).json({ message: 'Unable to get order', error: error });
  }
};

module.exports = {
  CreateOrder,
  getAllOrders,
  getOrderById
};
