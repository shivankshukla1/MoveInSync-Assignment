const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const VerificationOtpSchema = new mongoose.Schema({
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

VerificationOtpSchema.plugin(uniqueValidator); 

module.exports = mongoose.model("VerificationOtp", VerificationOtpSchema);