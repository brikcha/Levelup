 const  {User}  = require("../models/user");
 const Token = require("../models/token");
 const sendEmail = require("../utils/sendEmail");
 const crypto = require("crypto");
 const Joi = require("joi");
 const express = require("express");
 const router = express.Router();
 const jwt =require("jsonwebtoken");
 const bcrypt=require("bcryptjs")

 router.post("/", async (req, res) => {
   try {
         const schema = Joi.object({ email: Joi.string().email().required() });
         const { error } = schema.validate(req.body);
         if (error) return res.status(400).send(error.details[0].message);

       const user = await User.findOne({ email: req.body.email });
       if (!user)
           return res.status(400).send("user with given email doesn't exist");

       let token = await Token.findOne({ userId: user._id });
       if (!token) {
           token = await new Token({
              userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
          }).save();
       }

        const link = `${process.env.FO_URL}/${user._id}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
       res.send("An error occured");
       console.log(error);
    }
 });

 router.post("/:userId", async (req, res) => {
     try {
     
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
       if (!user) return res.status(400).send("invalid link or expired");

       

       user.password = await bcrypt.hash(req.body.password,12);
       await user.save();
       // await token.delete();

        res.status(200).send("password reset sucessfully.");
     } catch (error) {
        res.status(400).send("An error occured");
        console.log(error);
    }
 });

module.exports = router;