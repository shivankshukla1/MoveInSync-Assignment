const express = require("express");
const router = express();
const {UserRegister, UserLogin, AdminLogin, UserVerification, UserForgotPassword, UserNewPassword} = require("../controllers/authController");

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/adminlogin", AdminLogin);
router.post("/userverification", UserVerification);
router.post("/forgotpassword", UserForgotPassword);
router.post("/updatepassword", UserNewPassword);


module.exports = router;
