const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();

const User = require("../models/userInfo");
const Admin = require("../models/adminInfo");
const ForgotPasswordOtp = require("../models/ForgotPasswordOtp");
const VerificationOtp = require("../models/VerificationOtp");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const AdminLogin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (!existingAdmin) {
      return res.send({
        message: "Admin does not exist",
        success: false,
        data: null,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingAdmin.password
    );

    if (!isPasswordCorrect) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }


    const token = jwt.sign(
      { email: req.body.email, isAdmin: true},
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const admin = {
      name: existingAdmin.name,
      email: existingAdmin.email,
      _id: existingAdmin._id,
    };
    res.send({
      message: "Admin logged in successfully",
      success: true,
      data: token,
      admin: admin,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};



const UserRegister = (req, res) => {
  const { name, email, password } = req.body;
  var otp = generateOTP();
      
  // Check if the email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.send({
          message: "Email already exists",
          success: false,
          data: null,
        });
      }

      const newVerificationOtp = new VerificationOtp({
        email,
        otp,
      });

      return newVerificationOtp.save()
        .then(() => bcrypt.hash(password, 6))
        .then((hashedPassword) => {
          req.body.password = hashedPassword;
          const newUser = new User({
            name,
            email,
            password: req.body.password,
          });

          return newUser.save();
        });
    })
    .then(() => {
      const mailOptions = {
        from: "shivankshukla1729@gmail.com",
        to: email,
        subject: "Verification OTP",
        text: `Your verification OTP is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.send({
            message: `Failed to send OTP: ${error.message}`,
            success: false,
            data: null,
          });
        }

        return res.send({
          message: "User created successfully. Verification OTP sent to your email.",
          success: true,
          data: null,
        });
      }
      );
    })
    .catch((error) => {
      return res.send({
        message: error.message,
        success: false,
        data: null,
      });
    });
};


const UserLogin = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.send({
        message: "User does not exist",
        success: false,
        data: null,
      });
    }

    const isVerified = await VerificationOtp.findOne({ email: req.body.email });
    if (isVerified) {
      return res.send({
        message: "User has not been verified. Please check your email for the verification OTP.",
        success: false,
        data: null,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.send({
        message: "Incorrect password",
        success: false,
        data: null,
      });
    }

    const token = jwt.sign(
      { email: req.body.email, isAdmin: false},
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const user = {
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      _id: existingUser._id,
    };
    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
      user: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

const UserVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const verificationEntry = await VerificationOtp.findOne({ email, otp });

    if (!verificationEntry) {
      return res.send({
        message: "Invalid verification request",
        success: false,
        data: null,
      });
    }

    await VerificationOtp.deleteOne({ email, otp });


    
    res.send({
      message: "User verified successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

const UserForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newForgotPasswordOtp = new ForgotPasswordOtp({ email, otp });

    await newForgotPasswordOtp.save().then(() => {
      const mailOptions = {
        from: "shivankshukla1729@gmail.com",
        to: email,
        subject: "OTP For setting updating password",
        text: `Your verification OTP is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.send({
            message: `Failed to send OTP: ${error.message}`,
            success: false,
            data: null,
          });
        }

        return res.send({
          message: "User created successfully. Verification OTP sent to your email.",
          success: true,
          data: null,
        });
      }
      );
    })
    .catch((error) => {
      return res.send({
        message: error.message,
        success: false,
        data: null,
      });
    });
    
    res.send({
      message: "OTP sent successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

const UserNewPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const forgotPasswordEntry = await ForgotPasswordOtp.findOne({ email, otp });

    if (!forgotPasswordEntry) {
      return res.send({
        message: "Invalid OTP request",
        success: false,
        data: null,
      });
    }

    await ForgotPasswordOtp.deleteOne({ email, otp });

    const hashedPassword = await bcrypt.hash(newPassword, 6);
    await User.updateOne({ email }, { password: hashedPassword });

    res.send({
      message: "Password updated successfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
};

module.exports = { UserRegister, UserLogin, AdminLogin, UserVerification, UserForgotPassword, UserNewPassword };