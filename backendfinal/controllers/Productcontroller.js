const Product = require('../models/product');
const jwt = require('jsonwebtoken');

const createProduct = function(req, res) {
    // console.log(req, ' req ');
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(401).json({ error: "Authorization header missing" });
    // }
  
    // const token = authHeader.split(" ")[1];
    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const userRole = decodedToken.role;
  
    // if (userRole == "admin") {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to create a product" });
    // }
  
    const { name, description, price,category, rating,image ,stock} = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      rating,
      image: `/uploads/${req.files[0].filename}`,
      
    });
  
    product.save((err, product) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error creating product" });
      }
      console.log("Product created: ", product);
      res.status(201).json({ message: "Product created successfully" });
    });
  };
  const getProducts = function(req, res) {
    // console.log(req, ' req ');
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(401).json({ error: "Authorization header missing" });
    // }
  
    // const token = authHeader.split(" ")[1];
    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const userRole = decodedToken.role;
  
    // if (userRole !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to get list a product" });
    // }
    Product.find({}, (err, products) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting products" });
      }
      res.json(products);
    });
  };
  
const countProducts = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};
const stockProducts = async (req, res) => {
  try {
    const outOfStock = await Product.countDocuments({ stock: { $lte: 0 } });
    const inStock = await Product.countDocuments({ stock: { $gt: 0 } });
    res.status(200).json({ inStock, outOfStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to retrieve product count' });
  }
};
async function getBestSellers() {
  try {
    const bestSellers = await Product.find({}).sort({ bestSeller: -1 }).limit(10);
    console.log(bestSellers);
    // do something with the best-selling products
  } catch (error) {
    console.error(error);
  }
}

  const getProductById = function(req, res) {
    const productId = req.params.id;
    Product.findById(productId, (err, product) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting product" });
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    });
  };
  const evaluateProduct = function(req, res) {
    const productId = req.params.id;
    const ratingValue = req.body.rating;
  
    Product.findById(productId, (err, product) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error getting product" });
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      product.rating.push(ratingValue);
      product.save((err, product) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error saving product rating" });
        }
  
        // Calculate average rating
        const sum = product.rating.reduce((acc, curr) => acc + curr, 0);
        const avgRating = sum / product.rating.length;
  
        res.json({ message: "Product rating updated successfully", averageRating: avgRating });
      });
    });
  };
  

  
  
  const updateProduct = function(req, res) {
    //Check if user is authorized
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decodedToken.role;
    if (userRole == "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update a product" });
    }
  
    // Update product object
    const productId = req.params.id;
    const { name, description, price, category,stock } = req.body;
    Product.findByIdAndUpdate(
      productId,
      { name, description, price, category ,stock},
      { new: true },
      (err, product) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error updating product" });
        }
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        console.log("Product updated: ", product);
        res.json({ message: "Product updated successfully" });
      }
    );
  };
  const deleteProduct = function(req, res) {
    const productId = req.params.id;
    
    Product.findByIdAndDelete(productId, function(err, product) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error deleting product" });
      }
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      console.log("Product deleted: ", product);
      res.status(200).json({ message: "Product deleted successfully" });
    });
  };
    
   
  
  


module.exports = {
  createProduct,getProductById,getProducts,updateProduct,deleteProduct,evaluateProduct,countProducts,stockProducts,getBestSellers
};