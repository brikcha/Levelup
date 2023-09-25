const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuth=require('../middlewares/isAuth.middleware')
router.post('/add', cartController.AddproductToCart);
router.get('/list', cartController.GetCartItems);
router.delete('/cart/:cartId/:productId',  cartController.DeleteProductFromCart);
router.put('/carts/:cartId/:productId', cartController.IncrementCartItemQuantity);



module.exports = router;