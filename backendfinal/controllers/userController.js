/*const { User } = require("../models/user");
const bcrypt = require('bcrypt')

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, role } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(role) || !role.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, role }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

module.exports = {
    createNewUser  
}*/

const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Token = require("../models/token");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userRoutes=require("../routes/userRoutes");
// is activated 
async function sendEmail(email, subject, message) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
  
      console.log("Transporter created");
  
      const info = await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: message,
      });
  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log("Email not sent");
      console.log(error);
    }
  };

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { name, email,password,cv,specialite, birthDate,gender,
        role } = req.body

    // Confirm data
    if (!name || !password || !email  ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = {
        //username,
        name,
        email,
        password: hashedPwd,
        cv,
        specialite,
        birthDate:new Date(birthDate).toISOString().slice(0, 10),
        gender,
        role: role || 'admin' // default to 'admin' if role is not provided
    }

    // Create and store new user 
    const user = await User.create(userObject)

    // email confirmation 
     // Generate a verification token and save it to the database
     let token =  Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      token = await token.save();
     // Send a verification email to the user
const message = `${process.env.BASE_URL}/userRoutes/verify/${user._id}/${token.token}`;

   await sendEmail(user.email, "Verify Email", message);

    if (user) { //created 
        res.status(201).json({ message: `New user ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

  

}

const getUserById = (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      res.status(200).json({
        user: user
      });
    });
  };

 

module.exports = {
    createNewUser,getUserById
}




