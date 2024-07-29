require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./passport"); // passport is brought through a local file so the same object can be imported elsewhere
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const bcrypt = require("bcryptjs");

var app = express();

// this code is mostly copied from Erno Vanhala's passport-config.js from course material
const authenticateUser = async (email, password, done) => {
  const user = await User.findOne({ email: email });
  if (user == null) {
    return done(null, false);
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (e) {
    return done(e);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    authenticateUser
  )
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  return done(null, User.findOne({ _id: id }));
});

const mongoDB = "mongodb://localhost:27017/projectdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000, // 1 hour,
      rolling: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

var apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// this is mostly/completely copied from week 12 task instructions
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("..", "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("..", "client", "build", "index.html"));
  });
} else if (process.env.NODE_ENV === "development") {
  var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.use(cors(corsOptions));
}

module.exports = app;
