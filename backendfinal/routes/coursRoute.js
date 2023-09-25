const express = require('express');
const router = express.Router();
const coursController = require('../controllers/Courscontroller');
const verifyJWT = require('../middlewares/verifyJWT')
const sub=require ('../controllers/Courscontroller');

router.get('/list/:id', coursController.getCoursById);

router.delete('/delete/:id', coursController.deleteCours);
router.post("/cours/:id/evaluate", coursController.evaluateCours);
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

router.get('/list', coursController.getCours);
router.post('/add/:id',upload.any("image"), coursController.createCours);
router.put('/update/:id',upload.any("image"), coursController.updateCours);
  //subscribe a user
  router.put("/sub/:id", coursController.subscribe); 
  router.put("/unsubscribe/:id", coursController.unsubscribe);
 



module.exports = router;
