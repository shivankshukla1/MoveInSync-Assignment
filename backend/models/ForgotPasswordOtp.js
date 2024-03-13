const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ForgotPasswordOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

ForgotPasswordOtpSchema.plugin(uniqueValidator); // This ensures that the email field is unique

module.exports = mongoose.model("ForgotPasswordOtp", ForgotPasswordOtpSchema);
