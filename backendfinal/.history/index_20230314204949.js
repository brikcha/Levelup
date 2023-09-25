const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passwordReset = require("./utils/forgotpassword");


const adminRoute = require("./routes/admin.route");
const { isAuth, isAdmin } = require("./middlewares");
const test


// Bring in the app constants
const { DB, PORT } = require("./config");
const { verify } = require("jsonwebtoken");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());
app.use("/api/password-reset", passwordReset);
//app.use("/api/registrationbyemail", registrationemail);
//app.use("/api/verifyemail", verifyemail);


require("./middlewares/passport")(passport);

// User Router Middleware
app.use("/api/users2", );
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", isAuth, isAdmin, adminRoute);

const startApp = async () => {
  try {
    // Connection With DB
    await connect(DB, {
      //  useFindAndModify: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${DB}`,
      badge: true
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp();
