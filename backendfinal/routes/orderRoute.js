const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const Cart =require('../models/cart.model')
const Product =require('../models/product')

const orderController = require('../controllers/orderController');
const { calculateTotalPriceOfAllOrders } = require('../controllers/orderController');

router.post('/', orderController.CreateOrder);
router.get('/view/:orderId', orderController.ViewOrder);
router.get('/invoices/:orderId', orderController.getInvoice);
router.post('/fac/:orderId', orderController.generateInvoice);

router.get('/', orderController.getAllOrders);
// router.get('/:id', orderController.getOrderById);
router.get('/orderbyuser', orderController.getOrdersByUser);
// router.put('/update/:id', orderController.updateOrder);
router.put('/:orderId', orderController.updateOrderisPaid);
// router.get('/user', orderController.getOrdersByUser);
router.get('/count', orderController.getOrderCount);
router.get('/month', orderController.getOrderCountPerMonth);
router.get('/long', orderController.countOrders);

router.get('/day', orderController.countOrdersPerDay);

router.get('/total', async (req, res) => {
  try {
    const { total, orders } = await calculateTotalPriceOfAllOrders();
    res.json({ total, orders });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/orders/:id', async function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decodedToken.role;
    if (userRole == "admin") {
      return res.status(403).json({ error: "You are not authorized to update an order" });
    }
    const orderId = req.params.id;
    const { isDelivered, taxPrice, isPaid, shippingPrice, deliveredAt } = req.body;
    Order.findByIdAndUpdate(
      orderId,
      { isDelivered, taxPrice, isPaid, shippingPrice, deliveredAt },
      { new: true },
      (err, order) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error updating order" });
        }
        if (!order) {
          return res.status(404).json({ error: "order not found" });
        }
        console.log("order updated: ", order);
        res.json({ message: "order updated successfully" });
      }
    );
  });
  

module.exports = router;