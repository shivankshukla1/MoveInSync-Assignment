const jwt = require("jsonwebtoken");
require('dotenv').config();

const isLoggedIn = (req, res, next) => {
  try {

    const token = req.headers.authorization;
    // console.log("token is ", token);
    if (!token) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.email = decodedToken.email;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};

const isAdmin = (req,res,next) => {
  try {
    // console.log("Wer are here");
    // console.log(req.headers);
    const token = req.headers.authorization;
    // console.log("token is ", token);
    if (!token) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.email = decodedToken.email;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
}

module.exports = { isLoggedIn, isAdmin }
