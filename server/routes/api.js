require("dotenv").config();

var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Chat = require("../models/Chat");
const { isValidObjectId } = require("mongoose");
const passport = require("../passport");
const LocalStrategy = require("passport-local").Strategy;

router.get("/", function (req, res, next) {
  console.log(req.user._conditions._id);
  if (req.isAuthenticated()) {
    console.log("is authenticated");
  } else {
    console.log("is not authenticated");
  }
  res.status(200).json({ message: "api is up and running" });
});

router.get("/authenticated", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

router.get("/user", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.user._conditions._id });
  res.status(200).json({ email: user.email, name: user.name, description: user.description, likedUsers: user.likedUsers, dislikedUsers: user.dislikedUsers });
});

router.get("/user/name/:id", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });

    // check that the user and target user are matched or are the same
    const matchedUsers = await getMatches(user);
    if (matchedUsers.map((u) => u._id.toString()).includes(req.params.id) || req.user._conditions._id == req.params.id) {
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

router.get("/user/description/:id", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });

    // check that the user and target user are matched or are the same
    const matchedUsers = await getMatches(user);
    if (matchedUsers.map((u) => u._id.toString()).includes(req.params.id) || req.user._conditions._id == req.params.id) {
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

router.post(
  "/register",
  checkNotAuthenticated,
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
                passport.authenticate("local");
                res.status(201).json({ success: true });
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

router.post("/updateName", checkAuthenticated, body("name").trim().isLength({ min: 1, max: 256 }), async (req, res) => {
  try {
    if (validationResult(req).isEmpty()) {
      User.findOne({ _id: req.user._conditions._id }).then((user) => {
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

router.post("/updateDescription", checkAuthenticated, async (req, res) => {
  try {
    User.findOne({ _id: req.user._conditions._id }).then((user) => {
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

router.post("/updateEmail", checkAuthenticated, body("email").trim().isEmail(), async (req, res) => {
  try {
    if (validationResult(req).isEmpty()) {
      User.findOne({ email: req.body.email }).then((user) => {
        if (user != null) {
          return res.status(400).json({ email: "email taken" });
        } else {
          User.findOne({ _id: req.user._conditions._id }).then((user) => {
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
  checkAuthenticated,
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
  async (req, res) => {
    try {
      if (validationResult(req).isEmpty()) {
        User.findOne({ _id: req.user._conditions._id }).then((user) => {
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

router.post("/login", checkNotAuthenticated, passport.authenticate("local"), (req, res, next) => {
  res.status(200).json({ success: true });
});

router.post("/logout", checkAuthenticated, (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json({ redirect: true });
  });
});

router.get("/getUserToShow", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });
    if (!user) {
      return res.status(404).json({ errorMessage: "user not found" });
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

router.post("/like", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });
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

router.post("/dislike", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });
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

router.get("/matches", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });
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

router.post("/message", checkAuthenticated, async (req, res) => {
  try {
    // at this point the chat has already been created
    const chat = await Chat.findOne({ _id: req.body.chatId });
    if (chat == null) {
      res.status(404).json({ errorMessage: "failed to find chat" });
    } else {
      chat.messages.push({ sender: req.user._conditions._id, text: req.body.text });
      chat.save();
      res.status(200).json(chat.messages.at(-1));
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/chat/:targetUserId", checkAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._conditions._id });
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

// this code is mostly copied from Erno Vanhala's course material
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("is authenticated");
    return next();
  }
  console.log("is not authenticated");
  return res.status(401).json({ redirect: true });
}

// this code is mostly copied from Erno Vanhala's course material
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("is authenticated");
    return res.status(401).json({ redirect: true });
  }
  console.log("is not authenticated");
  return next();
}

module.exports = router;
