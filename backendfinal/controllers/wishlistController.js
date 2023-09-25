const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const jwt = require('jsonwebtoken');

const Product = require("../models/product");
const createWishlist = async (req, res) => {
    try {
      // Verify token and get user ID
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }
    
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.userId;

      const { productId } = req.body;
      const wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        // Create a new wishlist if the user doesn't have one
        const newWishlist = new Wishlist({
          user: userId,
          products: [productId]
        });
        await newWishlist.save();
        return res.status(201).json({ message: 'Product added to wishlist' });
      }
  
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
  
      wishlist.products.push(productId);
      await wishlist.save();
      res.status(201).json({ message: 'Product added to wishlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  const deleteProduct = async (req, res) => {
    try {
      // Verify token and get user ID
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }
    
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.userId;
  
      const wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      const productId = req.params.id;
      const index = wishlist.products.indexOf(productId);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found in wishlist' });
      }
  
      wishlist.products.splice(index, 1);
      await wishlist.save();
      res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const getWishlist = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
  
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
  
    try {
      const wishlists = await Wishlist.find({ user: userId }).populate('products', 'name price image category description');
  
      res.json({ wishlists: wishlists });
    } catch (error) {
      res.status(500).json({ message: 'Unable to fetch wishlist', error: error.message });
    }
  };
  
  
module.exports={createWishlist,deleteProduct,getWishlist}