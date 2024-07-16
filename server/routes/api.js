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

router.get("/getUserToShow", validateToken, async (req, res) => {
  try {
    const user = await awaitUser.findOne({ _id: req.user.id });

    // get users that are yet to be rated
    let users = await User.find({ _id: { $nin: [...user.likedUsers, ...user.dislikedUsers, user._id] } });

    // if no such users are found get users that are yet to be liked
    if (users.length == 0) {
      users = await User.find({ _id: { $nin: [...user.likedUsers, user._id] } });
    }

    // if no such users are found return nothing
    if (users.length == 0) {
      res.status(401).send("no viable users found");
    } else {
      // get a random user from found users
      const targetUser = users[randomNumber(0, users.length)];
      res.status(200).json({ name: targetUser.name, description: targetUser.description });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/like", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // remove liked user from disliked users
    const index = foundUser.dislikedUsers.indexOf(req.body.targetId);
    if (index >= 0) {
      user.dislikedUsers.splice(index, 1);
    }

    // save liked user to likedUsers
    user.likedUsers.push(req.body.targetId);
    user.save();
  } catch (err) {
    console.log(err);
  }
});

router.post("/dislike", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // remove disliked user from liked users
    const index = foundUser.likedUsers.indexOf(req.body.targetId);
    if (index >= 0) {
      user.likedUsers.splice(index, 1);
    }

    // save liked user to dislikedUsers
    user.dislikedUsers.push(req.body.targetId);
    user.save();
  } catch (err) {
    console.log(err);
  }
});

function randomNumber(min, max) {
  // returns [min, max[
  // if min == max, return min
  if (max >= min) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  return null;
}

module.exports = router;
