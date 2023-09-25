const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");


const GOOGLE_CLIENT_ID =
  "475891610117-spha1kr02vrbfftea8pib2g9kscuq59a.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

GITHUB_CLIENT_ID = "2e1a4972569ee3e562e9";
GITHUB_CLIENT_SECRET = "9da0123c02127ec88ddd57a3ec4c21237d5dc41f";

FACEBOOK_APP_ID = "514769600728871";
FACEBOOK_APP_SECRET = "38ff2c3510a208322bbeb3cfe8f64468";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
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
