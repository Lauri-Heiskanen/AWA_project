var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const validateToken = require("../auth/validateToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("api is up and running");
});

router.post(
  "/register",
  body("name").trim().isLength({ min: 1, max: 256 }).isAlpha().withMessage("invalid name"),
  body("email").trim().isEmail().withMessage("invalid email"),
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res) => {
    try {
      if (validationResult(req).isEmpty()) {
        User.findOne({ email: req.body.email }).then((user) => {
          if (user != null) {
            res.status(403).json({ email: "email taken" });
          } else {
            new User({
              name: req.body.name,
              email: req.body.email,
              description: req.body.description,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
              likedUsers: [],
              dislikedUsers: [],
            }).save();
            res.status(200).send("ok");
          }
        });
      } else {
        res.status(400).send();
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("something went wrong");
    }
  }
);

router.post("/login", (req, res) => {
  try {
    User.findOne({ email: req.body.email }).then((foundUser) => {
      if (bcrypt.compareSync(req.body.password, foundUser.password) && req.body.password) {
        jwt.sign(
          {
            id: foundUser._id,
            email: foundUser.email,
          },
          process.env.SECRET,
          { expiresIn: 120 },
          (err, token) => {
            res.json({ success: true, token });
          }
        );
      } else {
        res.status(400).send("auth failed");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/newUser", validateToken, (req, res) => {
  try {
    User.findOne({ _id: req.user.id }).then((foundUser) => {
      User.find({}, (users) => {
        if (foundUser.likedUsers.length + foundUser.dislikedUsers.length < users.length) {
          let newUser = users[randomNumber(0, users.length)];
          while (foundUser.dislikedUsers.include(newUser._id) || foundUser.likedUsers.include(newUser._id)) {
            newUser = users[randomNumber(0, users.length)];
          }
          res.status(200).json({ name: newUser.name, description: newUser.description });
        } else if (foundUser.likedUsers.length < users.length) {
          let newUser = users[randomNumber(0, users.length)];
          while (foundUser.dislikedUsers.include(newUser)) {
            newUser = users[randomNumber(0, users.length)];
          }
          res.status(200).json({ name: newUser.name, description: newUser.description });
        } else {
          res.status(404).send("no viable users found");
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/like", validateToken, (req, res) => {
  try {
    User.findOne({ _id: req.user.id }).then((foundUser) => {
      const index = foundUser.dislikedUsers.indexOf(req.body.targetId);
      if (index >= 0) {
        foundUser.dislikedUsers.splice(index, 1);
      }
      foundUser.likedUsers.push(req.body.targetId);
      foundUser.save();
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/dislike", validateToken, (req, res) => {
  try {
    User.findOne({ _id: req.user.id }).then((foundUser) => {
      const index = foundUser.likedUsers.indexOf(req.body.targetId);
      if (index >= 0) {
        foundUser.likedUsers.splice(index, 1);
      }
      foundUser.dislikedUsers.push(req.body.targetId);
      foundUser.save();
    });
  } catch (err) {
    console.log(err);
  }
});

function randomNumber(min, max) {
  if (max > min) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  return null;
}

module.exports = router;
