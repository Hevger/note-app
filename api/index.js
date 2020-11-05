const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const userRoute = require('./routes/userRoute');



// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log(err));


app.use(express.json());

// Use routes
app.use(userRoute);

// Start listening 
app.listen(5000, console.log("App is running on port 5000, go to localhost:5000 !"));
