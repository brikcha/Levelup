const express = require('express');
const router = express.Router();
const whishlistController = require('../controllers/wishlistController');
router.post("/whishlist", whishlistController.createWishlist);
router.delete("/whishlist/:id", whishlistController.deleteProduct);
router.get("/whishlist/", whishlistController.getWishlist);

module.exports = router;
