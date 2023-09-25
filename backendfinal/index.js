const cors = require("cors");
const express = require("express");
const path = require("path");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passwordReset = require("./utils/forgotpassword");
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const GithubStrategy = require("passport-github2").Strategy;
//const FacebookStrategy = require("passport-facebook").Strategy;
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
require("express-async-errors");
const authRoute = require("./routes/auth");
const passportSetup = require("./passport");
const cookieSession = require("cookie-session");
const corsOptions = require("./config/crosOptions");
const chatRouter = require("./routes/chat.routes");
const messageRouter = require("./routes/message.routes");
const gymRouter = require("./routes/gym.routes.js");
const postRoutes = require("./routes/post.routes");

/*const GOOGLE_CLIENT_ID =
  "475891610117-spha1kr02vrbfftea8pib2g9kscuq59a.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "2e1a4972569ee3e562e9";
GITHUB_CLIENT_SECRET = "9da0123c02127ec88ddd57a3ec4c21237d5dc41f";

FACEBOOK_APP_ID = "514769600728871";
FACEBOOK_APP_SECRET = "38ff2c3510a208322bbeb3cfe8f64468";*/

const adminRoute = require("./routes/admin.route");
const { isAuth, isAdmin } = require("./middlewares");

// Bring in the app constants
const { DB, PORT } = require("./config");
const { verify } = require("jsonwebtoken");

// Initialize the application
const app = express();

// Middlewares
//app.use(passport.session());
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use(logger);
app.use(errorHandler);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bp.json());
app.use(passport.initialize());
app.use("/api/password-reset", passwordReset);
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/api/userRoutes", require("./routes/userRoutes"));
app.use("/wish",require('./routes/whishRoute'));
app.use('/products', require('./routes/productRoute'));
app.use('/carts', require('./routes/cart.route'));
app.use('/orders', require('./routes/orderRoute'));
app.use('/uploads',express.static('uploads'));
app.use('/cours', require('./routes/coursRoute'));
app.use('/events', require('./routes/event.route'));

app.use("/chat", chatRouter);
app.use("/message", messageRouter); 
app.use("/gym", gymRouter);
app.use("/api/post", postRoutes);

//app.use("/api/registrationbyemail", registrationemail);
//app.use("/api/verifyemail", verifyemail); 

require("./middlewares/passport")(passport); 

// User Router Middleware
app.use("/api/users", require("./routes/users"));
// app.use("/api/admin", isAuth, isAdmin, adminRoute);

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
      badge: true,
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true,
    });
    startApp();
  }
};
/*passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID ,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

*/

startApp();
