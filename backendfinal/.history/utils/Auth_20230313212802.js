const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {User,validate} = require("../models/user");
const { SECRET } = require("../config");
const nodemailer = require('nodemailer');
const Token = require("../models/token");
const crypto = require("crypto");
const { file } = require("googleapis/build/src/apis/file");
////hajer
// const login = async (req, res) => {
//   try {
//     // validate data req.body
//     const { error } = loginValidation(req.body.data);
//     if (error) {
//       return res.status(400).send({ error });
//     }

//     // check if user exists in the database
//     const user = await userModel.findOne({ email: req.body.email });
//     console.log(req.body.email)
//     if (!user) {
//       return res
//         .status(401)
//         .send({ success: false, error: "Incorrect email or password" });
        
//     }

//     // check if password is correct
//     const passwordMatches = bcrypt.compareSync(
//       req.body.password,
//       user.password
//     );
//     if (!passwordMatches) {
//       return res
//         .status(401)
//         .send({ success: false, error: "Incorrect email or password" });
//     }

//     // check if user is banned
//     if (user.isBanned) {
//       return res
//         .status(403)
//         .send({ success: false, error: "Your account has been banned" });
//     }

//     const date = new Date();
//     date.setDate(date.getDate() + process.env.REFRESH_TOKEN_COOKIE_EXPIRATION);
//     const refreshtoken = jwt.sign(
//       { _id: user._id, displayName: user.displayName },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
//       }
//     );
//     res.cookie(process.env.REFRESH_TOKEN_NAME, `${refreshtoken}`, {
//       expires: date,
//       httpOnly: true,
//       secure: false,
//     });
//     res.send({ user: user, access_token: refreshtoken });
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(500)
//       .send({ success: false, error: "something went wrong" });
//   }
// };
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
/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, role, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false
      });
    }
    
    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
     image:__filename,
     cv:__filename
      
      
    });

    await newUser.save();
    // email confirmation 
     // Generate a verification token and save it to the database
     let token = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    token = await token.save();

    // Send a verification email to the user
    const message = `${process.env.BASE_URL}/users/verify/${newUser._id}/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", message);

    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please now login.",
      success: true
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, role, res) => {
  let { email, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false
    });
  }
  if(user.isActive==false){
    return res.status(403).json({
      message: "Account desactivated.",
      success: false


    })
  }

  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  }


  if (!passwordMatches) {
      return res
        .status(401)
        .send({ success: false, error: "Incorrect email or password" });
    }

    // check if user is banned
    if (user.isBanned) {
      return res
        .status(403)
        .send({ success: false, error: "Your account has been banned" });
    }

    const date = new Date();
    date.setDate(date.getDate() + process.env.REFRESH_TOKEN_COOKIE_EXPIRATION);
    const refreshtoken = jwt.sign(
      { _id: user._id, displayName: user.displayName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }
    );
    res.cookie(process.env.REFRESH_TOKEN_NAME, `${refreshtoken}`, {
      expires: date,
      httpOnly: true,
      secure: false,
    });
    res.send({ user: user, access_token: refreshtoken });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "something went wrong" });
  }
};
};

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = user => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
    role:user.role
  };
};

module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser,
  // login
};

