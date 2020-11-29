const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController");
const expressJwt = require("express-jwt");
require("dotenv").config();

const secret = process.env.secretOrKey;

// Create new note
router.post(
  "/create",
  expressJwt({ secret, algorithms: ["HS256"] }),
  noteController.createNote
);

// Create new note
router.get(
  "/:id",
  expressJwt({ secret, algorithms: ["HS256"] }),
  noteController.getNote
);

// Delete
router.delete(
  "/:id",
  expressJwt({ secret, algorithms: ["HS256"] }),
  noteController.deleteNote
);

// Update
router.post(
  "/:id",
  expressJwt({ secret, algorithms: ["HS256"] }),
  noteController.updateNote
);

// Get all notes
router.get(
  "/",
  expressJwt({ secret, algorithms: ["HS256"] }),
  noteController.getAllNotes
);

// Export routes
module.exports = router;
