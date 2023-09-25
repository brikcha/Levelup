const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { User } = require("../models/user");
const Token = require("../models/token");
const crud=require("../utils/crud");
//const verifyJWT = require('../middlewares/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    
    .post(userController.createNewUser)


router.get("/verify/:id/:token", async (req, res) => {
        try {
          // Find the user by ID
          const user = await User.findOne({ _id: req.params.id });
          if (!user) return res.status(400).send("Invalid link");
      
          // Find the verification token
          const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
          });
          if (!token) return res.status(400).send("Invalid link");
      
          // Update the user's verification status and remove the token
          user.isActive = true;
          await user.save();
          await Token.findByIdAndRemove(token._id);
      
          res.status(200).send("Email verified successfully");
        } catch (error) {
          console.log(error);
          res.status(500).send("An error occurred");
        }
      });
      router.put("/:id/ban", crud.banUserAccount);


      router.get('/:userId', userController.getUserById);


module.exports = router