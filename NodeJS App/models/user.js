const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  Goal: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
