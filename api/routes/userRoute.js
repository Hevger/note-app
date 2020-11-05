const express = require("express");
const router = express.Router();
const userController = require('../controller/userController')

// Registration 
router.post("/register", userController.registerUser);


// Export routes
module.exports = router;
