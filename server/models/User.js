const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
