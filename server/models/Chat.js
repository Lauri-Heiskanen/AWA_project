const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String }],
});

module.exports = mongoose.model("Chat", chatSchema);
