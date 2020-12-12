const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userRegistrationValidator = require("../validation/userRegistrationValidator");
const userLoginValidator = require("../validation/userLoginValidator");
require("dotenv").config();

// Register new user
exports.registerUser = (req, res) => {
  // Send data to validation
  const userRegistrationResult = userRegistrationValidator(req.body);

  if (userRegistrationResult.isValid) {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      registrationDate: Date.now(),
    });

    // Check if user already exists
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.json({ errorMessage: "User already exsits" });
      } else {
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      }
    });
  } else {
    res.status(401).json(userRegistrationResult.errors);
  }
};

// User login
exports.loginUser = (req, res) => {
  console.log(req.body);
  const userLoginResult = userLoginValidator(req.body);

  const email = req.body.email;
  const password = req.body.password;

  if (userLoginResult.isValid) {
    // Find user by email
    User.findOne({ email }).then((currentUser) => {
      // Check for company
      if (!currentUser) {
        userLoginResult.errors.error =
          "Please provide a valid username and password.";
        return res.status(401).json(userLoginResult.errors);
      } else {
        // User exists let's check his password

        bcrypt.compare(password, currentUser.password).then((isMatch) => {
          // Password is correct let's create a token and send it back
          if (isMatch) {
            // Create JWT Payload
            const payload = {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
            };

            // Sign Token
            jwt.sign(
              payload,
              process.env.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            userLoginResult.errors.error =
              "Please provide a valid username and password.";
            return res.status(401).json(userLoginResult.errors);
          }
        });
      }
    });
  } else {
    res.status(401).json(userLoginResult.errors);
  }
};

// Get current loggedin user
exports.currentUser = (req, res) => {
  res.json(req.user);
};
