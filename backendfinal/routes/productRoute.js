const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { spawn } = require('child_process');
const axios = require('axios');

const productController = require('../controllers/Productcontroller');
router.get('/list/:id', productController.getProductById);
router.post('/run-script', (req, res) => {
  const { age, height, weight, gender, num_meals, activity_level } = req.body;
  console.log('Received request with body:', req.body);
  console.log('Parsed variables:', { age, height, weight, gender, num_meals, activity_level });

  const script = spawn('python', ['./Python/Menu.py', age.toString(), height.toString(), weight.toString(), gender.toString(), num_meals.toString(), activity_level.toString()]);
  console.log('Spawned child process:', script.pid);

  var output = '';

  script.stdout.on('data', (data) => {
    output += data.toString();
    res.status(200).json({ data: JSON.parse(output) })
    console.log('Received data from child process:', data.toString());
  });
  // script.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`);
  //   console.log('Received error data from child process:', data.toString());
  //   output += data.toString(); // ajouter les données d'erreur à l'output
  // });

  script.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    console.log('Child process output:', output);
    if (output.trim() !== '') {
      const result = JSON.parse(output);
      const responseObj = {
        'BMI': result['BMI'],
        'Calorie Intake': result['Calorie Intake'],
        'Sports Activity': result['Sports Activity'],
        'Diet': result['Diet']
      };
      setTimeout(() => { // Ajouter un délai avant d'envoyer la réponse
        res.json(responseObj);
      }, 500); // Délai en millisecondes
    } else {
      res.status(500).send('Empty output from script');
    }
  });
});
router.get('/', async (req, res) => {
  try {
    const bestSellers = await Product.find({}).sort({ bestSeller: -1 }).limit(3);
    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.post("/products/:id/evaluate", productController.evaluateProduct);
const multer = require("multer"); // importation pour upload image
filename="";

//upload image
const mystorage= multer.diskStorage({
    destination:"./uploads",
    filename(req, file, cb) {
      cb(null, `${Date.now()}.jpg`);
  },
})


const upload= multer({storage:mystorage});

router.get('/list', productController.getProducts);
router.post('/add',upload.any("image"), productController.createProduct);
router.get('/count', productController.countProducts);

router.get('/stock', productController.stockProducts);




module.exports = router;
