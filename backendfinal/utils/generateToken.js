const jwt = require("jsonwebtoken");

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "30d" }
  );
};


module.exports = { tokenForVerify };
