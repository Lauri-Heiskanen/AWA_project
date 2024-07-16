var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const validateToken = require("../auth/validateToken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/api/user/register",
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

router.post("/api/user/login", (req, res) => {
  try {
    User.findOne({ email: req.body.email }).then((newUser) => {
      if (bcrypt.compareSync(req.body.password, newUser.password) && req.body.password) {
        jwt.sign(
          {
            id: newUser._id,
            email: newUser.email,
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

module.exports = router;
