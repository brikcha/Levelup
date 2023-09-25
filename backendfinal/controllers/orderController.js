const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const Cart =require('../models/cart.model')
const Product =require('../models/product')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');

const User=require('../models/user')
const CreateOrder = async function(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.UserInfo.userId;
  const userEmail = decodedToken.UserInfo.email;
  const userName = decodedToken.UserInfo.name;
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ idUser: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate the total price of the order
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Update product stock and create a new order
    let orderProducts = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Not enough stock for product ${product._id}` });
      }
      product.stock -= item.quantity;
      await product.save();
      orderProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      });
    }

    const order = new Order({
      idUser: userId,
      products: orderProducts,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      phoneNumber: req.body.phoneNumber,
      totalPrice: totalPrice,
    });

    const savedOrder = await order.save();
    const invoiceData = {
      orderId: savedOrder._id,
      userId: savedOrder.idUser,
      products: savedOrder.products,
      shippingAddress: savedOrder.shippingAddress,
      paymentMethod: savedOrder.paymentMethod,
      phoneNumber: savedOrder.phoneNumber,
      totalPrice: savedOrder.totalPrice,
      userEmail: userEmail,
      userName: userName,    };

    // Call method to generate invoice
    generateInvoice(invoiceData);
    res.json({ message: 'Order created', order: savedOrder });

  } catch (error) {
    res.status(500).json({ message: 'Unable to create order', error: error });
  }
}

const generateInvoice = async function(orderData) {
  // Create a new PDF document
  const doc = new PDFDocument();
  
  // Set the file name of the PDF
  const fileName = `./invoices/invoice-${orderData.orderId}.pdf`;

  // Pipe the PDF document to a file stream
  const fileStream = fs.createWriteStream(fileName);
  doc.pipe(fileStream);
  doc.image('./assets/logo.png', doc.page.width - 150, 50, { width: 100 });

  // Add the invoice header
  doc.fontSize(24).font('Helvetica-Bold').text('Invoice', { align: 'center' });
  doc.moveDown();

  // Add the order information
  doc.fontSize(14).text(`Order ID: ${orderData.orderId}`);
  doc.fontSize(14).text(`User ID: ${orderData.userId}`);
  doc.fontSize(12).text('Customer Details', { underline: true }).moveDown(0.5);
  doc.fontSize(14).text(`Customer email: ${orderData.userEmail}`);
  doc.fontSize(14).text(`Customer name: ${orderData.userName}`);

  doc.fontSize(14).text('Shipping Address:', { underline: true });
  doc.fontSize(14).text(orderData.shippingAddress);
    doc.fontSize(14).text(`Payment Method: ${orderData.paymentMethod}`);
  doc.fontSize(14).text(`Phone Number: ${orderData.phoneNumber}`);
  doc.moveDown();

  // Add the product information
  doc.fontSize(14).text('Products:', { underline: true });
  for (const product of orderData.products) {
    doc.fontSize(12).text(`Name: ${product.product.name}`);
    doc.fontSize(12).text(`Price: $${product.price.toFixed(2)}`);
    doc.fontSize(12).text(`Quantity: ${product.quantity}`);
    doc.moveDown();
  }

  // Add the total price
  doc.fontSize(14).text(`Total Price: $${orderData.totalPrice.toFixed(2)}`, { align: 'right' });

  // Add QR code
  const qrCodeData = `Invoice ID: ${orderData.orderId}\nTotal Price: $${orderData.totalPrice.toFixed(2)}`;
  const qrCodeImage = await QRCode.toBuffer(qrCodeData);
  doc.moveDown().image(qrCodeImage, { fit: [250, 250], align: 'center' });

  // End the document
  doc.end();
  

  // You can save the PDF file path to your database or send it via email to the user
};



const ViewOrder = async function(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.UserInfo.userId;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: `Order ${req.params.id} not found` });
    }

    if (userId !== order.idUser.toString()) {
      return res.status(403).json({ message: "You are not authorized to view this order" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${order._id}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(14).text('Invoice', { align: 'center' }).moveDown(0.5);
    doc.fontSize(10).text(`Invoice Number: ${order._id}`).moveDown(0.5);
    doc.fontSize(10).text(`Date: ${order.createdAt.toDateString()}`).moveDown(1);

    doc.fontSize(12).text('Customer Details').moveDown(0.5);
    doc.fontSize(10).text(`Name: ${decodedToken.UserInfo.name}`).moveDown(0.5);
    doc.fontSize(10).text(`Email: ${decodedToken.UserInfo.email}`).moveDown(0.5);
    doc.fontSize(10).text(`Address: ${order.shippingAddress}`).moveDown(1);

    doc.fontSize(12).text('Products').moveDown(0.5);
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      doc.fontSize(10).text(`${product.name} x ${item.quantity} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).moveDown(0.5);
    }

    doc.fontSize(12).text(`Total Price: $${order.totalPrice.toFixed(2)}`).moveDown(1);

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getInvoice = async function(req, res) {
  try {
    const orderId = req.params.orderId;
    const invoicePath = `./invoices/invoice-${orderId}.pdf`;

    // Check if the invoice file exists
    if (!fs.existsSync(invoicePath)) {
      return res.status(404).json({ message: `Invoice ${orderId} not found` });
    }

    // Read the invoice file as a buffer
    const fileBuffer = fs.readFileSync(invoicePath);
    console.log('Invoice file buffer:', fileBuffer);

    // Send the buffer as the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    res.send(fileBuffer);

  } catch (error) {
    console.log('Error while getting invoice:', error);
    res.status(500).json({ message: 'Unable to get invoice', error: error });
  }
}




const getOrderCount = async (req, res) => {
  try {
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const undeliveredOrders = await Order.countDocuments({ isDelivered: false });
    const unpaidOrders = await Order.countDocuments({ isPaid: false });
    res.status(200).json({ paid: paidOrders, unpaid: unpaidOrders, delivered:deliveredOrders, undelivered: undeliveredOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to retrieve order count' });
  }
};
const countOrdersPerDay = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { 
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to retrieve order count' });
  }
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
      
        const productId = req.params.id;
        const { name, description, price, category } = req.body;
        Product.findByIdAndUpdate(
          productId,
          { name, description, price, category },
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
   async function getOrderCountPerMonth() {
  try {
    console.log("Fetching orders from database...");
    const orders = await Order.aggregate([
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log("Orders grouped by month and year:", orders);
    const result = orders.map(order => ({
      month: order._id.month,
      year: order._id.year,
      count: order.count
    }));

    console.log("Result after formatting data:", result);
    result.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      } else {
        return b.month - a.month;
      }
    });

    console.log("Result after sorting:", result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function calculateTotalPriceOfAllOrders() {
  const orders = await Order.find();
  const totalPrice = orders.reduce((total, order) => total + order.totalPrice, 0);
  const ordersWithTotalPrice = orders.map(order => ({
    _id: order._id,
    totalPrice: order.totalPrice,
    ...order._doc
  }));
  return { total: totalPrice, orders: ordersWithTotalPrice };
}

const countOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
    
// const getOrderById = async function(req, res) {
//   const orderId = req.params.id;
//   Order.findById(orderId, (err, order) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: "Error getting order" });
//     }
//     if (!order) {
//       return res.status(404).json({ error: "order not found" });
//     }
//     res.json(order);
//   });
// };
 const getOrdersByUser = async function(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "Authorization header missing" });
        }
      
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.UserInfo.userId;
      
        try {
          const orders = await Order.find({ idUser: userId });
          res.json({ orders: orders });
        } catch (error) {
          res.status(500).json({ message: 'Unable to get orders', error: error });
        }
      };
      const updateOrderisPaid = async (req, res) => {
        try {
          const { orderId } = req.params;
          const isPaid = true
          const { transactionId } = req.body;
          const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { isPaid, transactionId } }, { new: true });
          res.send(updatedOrder);
        } catch (error) {
          res.status(500).send(error);
        }
      };
      

module.exports = {
  CreateOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderisPaid,
  getOrderCount,
  getOrderCountPerMonth,
  calculateTotalPriceOfAllOrders,
  countOrders,
  countOrdersPerDay,
  ViewOrder,
  getInvoice,
  generateInvoice
};