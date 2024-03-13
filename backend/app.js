const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.listen(5000 ,()=>{
    console.log("the server is up and running");
});

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("Connected to MongoDb");
}).catch((err) => {
    console.log(err);
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

//Tables
//1. userInfo {name, email, password}
//2. verificationOtp {email, OTP}
//3. forgotPasswordOtp {email, OTP}
//4. adminInfo
//API'S
//1. auth Registration
//2. auth Login - User and Admin
//3. auth Verification 
//4. auth Forgot Password
//5. auth Forgot Password Reset
//5. admin Add Bus
//6. admin Update Bus
//7. admin Delete Bus
//8. user Search Bus
//9. user Seat Booking
//xx. get all the buses         
//10. user Seat cancelation
//11. user Get all ticket