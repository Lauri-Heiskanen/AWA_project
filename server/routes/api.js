require("dotenv").config();

var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Chat = require("../models/Chat");
const validateToken = require("../auth/validateToken");
const { isValidObjectId } = require("mongoose");

router.get("/", function (req, res, next) {
  res.status(200).json({ message: "api is up and running" });
});

router.get("/user", validateToken, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  res.status(200).json({ email: user.email, name: user.name, description: user.description, likedUsers: user.likedUsers, dislikedUsers: user.dislikedUsers });
});

router.get("/user/name/:id", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // check that the user and target user are matched or are the same
    const matchedUsers = await getMatches(user);
    if (matchedUsers.map((u) => u._id.toString()).includes(req.params.id) || req.user.id == req.params.id) {
      const targetUser = await User.findOne({ _id: req.params.id });
      res.status(200).json({ name: targetUser.name });
    } else {
      res.status(403).json({ errorMessage: "not matched with target" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.get("/user/description/:id", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // check that the user and target user are matched or are the same
    const matchedUsers = await getMatches(user);
    if (matchedUsers.map((u) => u._id.toString()).includes(req.params.id) || req.user.id == req.params.id) {
      const targetUser = await User.findOne({ _id: req.params.id });
      res.status(200).json({ description: targetUser.description });
    } else {
      res.status(403).json({ errorMessage: "not matched with target user" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.get("/authenticated", (req, res) => {
  // this is mostly copied from Erno Vanhala's web-applications-week-8/auth/validateToken.js course material
  const authHeader = req.headers["authorization"];
  let token = null;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) res.json({ authenticated: false });
    else res.json({ authenticated: true });
  });
});

router.post(
  "/register",
  body("name").trim().isLength({ min: 1, max: 256 }),
  body("email").trim().isEmail(),
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res) => {
    try {
      if (validationResult(req).isEmpty()) {
        User.findOne({ email: req.body.email }).then((user) => {
          if (user != null) {
            res.status(400).json({ email: "email taken" });
          } else {
            new User({
              name: req.body.name,
              email: req.body.email,
              description: req.body.description,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
              likedUsers: [],
              dislikedUsers: [],
            })
              .save()
              .then(() => {
                User.findOne({ email: req.body.email }).then((newUser) => {
                  const token = jwt.sign(
                    {
                      id: newUser._id,
                      email: newUser.email,
                    },
                    process.env.SECRET,
                    { expiresIn: "1h" }
                  );
                  res.status(201).json({ success: true, token });
                });
              });
          }
        });
      } else {
        res.status(400).json({ errorMessage: validationResult(req) });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ errorMessage: "something went wrong" });
    }
  }
);

router.post("/updateName", validateToken, body("name").trim().isLength({ min: 1, max: 256 }), async (req, res) => {
  try {
    if (validationResult(req).isEmpty()) {
      User.findOne({ _id: req.user.id }).then((user) => {
        if (user == null) {
          return res.status(404).json({ errorMessage: "user not found" });
        } else {
          user.name = req.body.name;
          return user.save().then(() => res.status(200).json({ message: "ok" }));
        }
      });
    } else {
      res.status(400).json({ errorMessage: "invalid credentials", reason: validationResult(req) });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.post("/updateDescription", validateToken, async (req, res) => {
  try {
    User.findOne({ _id: req.user.id }).then((user) => {
      if (user == null) {
        return res.status(404).json({ errorMessage: "user not found" });
      } else {
        user.description = req.body.description;
        return user.save().then(() => res.status(200).json({ message: "ok" }));
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.post("/updateEmail", validateToken, body("email").trim().isEmail(), async (req, res) => {
  try {
    if (validationResult(req).isEmpty()) {
      User.findOne({ email: req.body.email }).then((user) => {
        if (user != null) {
          return res.status(400).json({ email: "email taken" });
        } else {
          User.findOne({ _id: req.user.id }).then((user) => {
            if (user == null) {
              return res.status(404).json({ errorMessage: "user not found" });
            } else {
              user.email = req.body.email;
              return user.save().then(() => res.status(200).json({ message: "ok" }));
            }
          });
        }
      });
    } else {
      res.status(400).json({ errorMessage: validationResult(req) });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.post(
  "/updatePassword",
  validateToken,
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res) => {
    try {
      if (validationResult(req).isEmpty()) {
        User.findOne({ _id: req.user.id }).then((user) => {
          if (user == null) {
            return res.status(404).json({ errorMessage: "user not found" });
          } else {
            user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            user.save();
            return res.status(200).json({ message: "ok" });
          }
        });
      } else {
        res.status(400).json({ errorMessage: validationResult(req) });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ errorMessage: "something went wrong" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    User.findOne({ email: req.body.email }).then(async (foundUser) => {
      if (foundUser && bcrypt.compareSync(req.body.password, foundUser.password) && req.body.password) {
        const token = jwt.sign(
          {
            id: foundUser._id,
            email: foundUser.email,
          },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
        res.json({ success: true, token });
      } else {
        res.status(401).json({ errorMessage: "auth failed" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "something went wrong" });
  }
});

router.get("/getUserToShow", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401).json({ errorMessage: "user not found" });
    }

    // get users that are yet to be rated
    let users = await User.find({ _id: { $nin: [...user.likedUsers, ...user.dislikedUsers, user._id] } });

    // if no such users are found get users that are yet to be liked
    if (users.length == 0) {
      users = await User.find({ _id: { $nin: [...user.likedUsers, user._id] } });
    }

    // if no such users are found return nothing
    if (users.length == 0) {
      res.status(404).json({ errorMessage: "no viable users found" });
    } else {
      // get a random user from found users
      const targetUser = users[randomNumber(0, users.length)];
      res.status(200).json({ name: targetUser.name, description: targetUser.description, id: targetUser._id });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/like", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401).json({ errorMessage: "user not found" });
    }

    if (!isValidObjectId(req.body.targetId)) {
      return res.status(400).json({ errorMessage: "not valid ObjectId" });
    }

    const targetUser = await User.findOne({ _id: req.body.targetId });
    if (!targetUser) {
      return res.status(401).json({ errorMessage: "user not found" });
    }

    // remove liked user from disliked users
    let index = user.dislikedUsers.indexOf(req.body.targetId);
    if (index >= 0) {
      user.dislikedUsers.splice(index, 1);
    }
    // skip if target already in likedUsers
    if (user.likedUsers.includes(req.body.targetId)) {
      return res.status(200).json({ message: "ok" });
    }

    // save liked user to likedUsers
    user.likedUsers.push(req.body.targetId);
    user.save();
    res.status(201).json({ errorMessage: "ok" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/dislike", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401).json({ errorMessage: "user not found" });
    }

    if (!isValidObjectId(req.body.targetId)) {
      return res.status(400).json({ errorMessage: "not valid ObjectId" });
    }

    const targetUser = await User.findOne({ _id: req.body.targetId });
    if (!targetUser) {
      return res.status(401).json({ errorMessage: "user not found" });
    }

    // remove disliked user from liked users
    const index = user.likedUsers.indexOf(req.body.targetId);
    if (index >= 0) {
      user.likedUsers.splice(index, 1);
    }

    // skip if target already in dislikedUsers
    if (user.dislikedUsers.includes(req.body.targetId)) {
      return res.status(200).json({ message: "ok" });
    }

    // save liked user to dislikedUsers
    user.dislikedUsers.push(req.body.targetId);
    user.save();
    res.status(201).json({ errorMessage: "ok" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/matches", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401).json({ errorMessage: "user not found" });
    }
    const matchedUsers = await getMatches(user);
    res.json(
      matchedUsers.map((u) => {
        return {
          name: u.name,
          id: u._id,
        };
      })
    );
  } catch (err) {
    console.log(err);
  }
});

router.post("/message", validateToken, async (req, res) => {
  try {
    // at this point the chat has already been created
    const chat = await Chat.findOne({ _id: req.body.chatId });
    if (chat == null) {
      res.status(404).json({ errorMessage: "failed to find chat" });
    } else {
      chat.messages.push({ sender: req.user.id, text: req.body.text });
      chat.save();
      res.status(200).json(chat.messages.at(-1));
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/chat/:targetUserId", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401).json({ errorMessage: "user not found" });
    }
    // check that the user and target user are matched
    const matchedUsers = await getMatches(user);
    if (matchedUsers.map((user) => user._id.toString()).includes(req.params.targetUserId)) {
      // find chat where "users" contains both ids
      let chat = await Chat.findOne({ users: { $all: [user._id, req.params.targetUserId] } });
      // if chat isn't found, it is created
      if (chat == null) {
        chat = new Chat({ users: [user._id, req.params.targetUserId], messages: [] });
        new Chat(chat).save();
      }
      const targetUser = await User.findOne({ _id: req.params.targetUserId });
      res.status(200).json({ user: targetUser.name, targetUserId: targetUser._id, messages: chat.messages, chatId: chat._id });
    } else {
      res.status(403).json({ errorMessage: "not matched with target user" });
    }
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

async function getMatches(user) {
  const likedUsers = await User.find({ _id: { $in: [...user.likedUsers] } });
  const matchedUsers = likedUsers.filter((u) => u.likedUsers.includes(user._id));
  return matchedUsers;
}

module.exports = router;
