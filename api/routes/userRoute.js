const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const expressJwt = require("express-jwt");
require("dotenv").config();

const secret = process.env.secretOrKey;

// Registration
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Current user
router.get(
  "/me",
  expressJwt({ secret, algorithms: ["HS256"] }),
  userController.currentUser
);

// Export routes
module.exports = router;
