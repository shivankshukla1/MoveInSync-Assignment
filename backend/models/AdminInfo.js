const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const AdminInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

AdminInfoSchema.plugin(uniqueValidator); // This ensures that the email field is unique

module.exports = mongoose.model("AdminInfo", AdminInfoSchema);