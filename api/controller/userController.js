const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const userRegistrationValidator = require('../validation/userRegistrationValidator');

// Register new user
exports.registerUser = (req, res) => {
    
   
    // Send data to validation
    const userRegistrationResult = userRegistrationValidator(req.body);
   
    if(userRegistrationResult.isValid){
    
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email,
            registrationDate: Date.now()
        });

        // Check if user already exists
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                res.json({errorMessage: "User already exsits"});
            }else{
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));  
            }
        })             
    }else{
        res.json(userRegistrationResult.errors);
    }
};
