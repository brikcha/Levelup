const { cp } = require('fs');
const Cart = require('../models/cart.model');
const Product = require('../models/product');
const jwt = require("jsonwebtoken");


const AddproductToCart = async function(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token =====> ",token)
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.UserInfo.userId;
  console.log("User ID ====> ",userId);
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  console.log('Product:', product);
  try {
    // Recherche du panier pour l'utilisateur connecté
    const cart = await Cart.findOne({ idUser: userId });
    console.log("Cart ====> ",cart);
    // Si le panier existe déjà, vérifie si le produit existe déjà dans le panier
    if (cart) {
      let itemExists = false;
      cart.items.forEach(item => {
        if (item.productId == productId) {
          item.quantity += quantity; // incrémenter la quantité existante
          item.total = item.quantity * product.price; // mettre à jour le prix total
          itemExists = true;
        }
      });

      // Si le produit n'existe pas encore, l'ajouter au panier
      if (!itemExists) {
        const newItem = { 
          productId: productId, 
          quantity: quantity, 
          name: product.name, 
          price: product.price ,
          image:product.image,
          total: quantity * product.price, 
        };
        cart.items.push(newItem);
      }

      const savedCart = await cart.save();
      const totalCartPrice = cart.items.reduce((total, item) => total + item.total, 0); // calculer le prix total du panier
      res.json({ message: 'Item added to cart', cart: savedCart, totalCartPrice: totalCartPrice });

    } else {
      // Si le panier n'existe pas encore, créer un nouveau panier et y ajouter l'élément
      const newItem = { 
        productId: productId, 
        quantity: quantity, 
        name: product.name, 
        price: product.price ,
        image:product.image,
        total: quantity * product.price,
      };

      const newCartItem = new Cart({
        idUser: userId,
        items: [newItem]
      });

      const savedCart = await newCartItem.save();
      res.json({ message: 'Item added to cart', cart: savedCart, totalCartPrice: newItem.total });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to add item to cart', error: error });
  }
}



  const GetCartItems = async function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
  
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.UserInfo.userId;
  
    try {
      const cart = await Cart.findOne({ idUser: userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.json({ items: cart.items });
    } catch (error) {
      res.status(500).json({ message: 'Unable to get cart items', error: error });
    }
  }
  const DeleteProductFromCart  = async function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
  
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.UserInfo.userId;
  
    const cart = await Cart.findOne({ idUser: userId });
  
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
  
    const productId = req.params.productId;
  
    // Find the item in the cart that matches the product ID
    const itemIndex = cart.items.findIndex(item => item.productId == productId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  
    cart.items.splice(itemIndex, 1); // remove the item from the cart
  
    try {
      const savedCart = await cart.save();
      res.json({ message: 'Item removed from cart', cart: savedCart });
    } catch (error) {
      res.status(500).json({ message: 'Unable to remove item from cart', error: error });
    }
  }
  const IncrementCartItemQuantity = async function(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
  
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.UserInfo.userId;
  
    // const cartId = req.params.cartId;
    const productId = req.params.productId;
    // console.log("cartId:", cartId); 

  
    try {
      const cart = await Cart.findOne({idUser: userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      let itemExists = false;
      cart.items.forEach(item => {
        if (item.productId == productId) {
          item.quantity++; // incrémenter la quantité existante
          itemExists = true;
        }
      });
  
      if (!itemExists) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      const savedCart = await cart.save();
      res.json({ message: 'Item quantity incremented', cart: savedCart });
  
    } catch (error) {
      res.status(500).json({ message: 'Unable to increment item quantity', error: error });
    }
  }
  
  
  
  
  module.exports = {
    AddproductToCart,
    GetCartItems,
    DeleteProductFromCart,
    IncrementCartItemQuantity
  };
