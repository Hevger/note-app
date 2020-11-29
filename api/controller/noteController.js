const mongoose = require("mongoose");
const Note = require("../models/Note");
const creatingNoteValidator = require("../validation/creatingNoteValidator");

require("dotenv").config();

// Creating new note
exports.createNote = (req, res) => {
  // Validate inputs
  const creatingNoteValidatorResult = creatingNoteValidator(req.body);

  if (creatingNoteValidatorResult.isValid) {
    const newNote = new Note({
      title: req.body.title,
      owner: req.user.id,
      date: Date.now(),
      content: req.body.content,
    });

    newNote
      .save()
      .then((note) => res.json(note))
      .catch((err) => console.log(err));
  } else {
    res.json(creatingNoteValidatorResult.errors);
  }
};

// Get note
exports.getNote = (req, res) => {
  Note.findById(req.params.id).then((currentNote) => {
    if (currentNote.owner == req.user.id) {
      res.json(currentNote);
    } else {
      return res.status(401).json({
        message: "You don't have permission to access this note",
      });
    }
  });
};

// Get all notes
exports.getAllNotes = (req, res) => {
  Note.find({ owner: req.user.id })
    .then((notes) => {
      if (!notes) {
        errors.notes = "No notes yet!";
        return res.status(404).json(errors);
      }
      res.json(notes);
    })
    .catch((err) => console.log(err));
};

// Update note
exports.updateNote = (req, res) => {
  Note.findById(req.params.id).then((currentNote) => {
    if (currentNote.owner == req.user.id) {
      const creatingNoteValidatorResult = creatingNoteValidator(req.body);
      if (creatingNoteValidatorResult.isValid) {
        (currentNote.title = req.body.title),
          (currentNote.content = req.body.content),
          (currentNote.date = Date.now());

        currentNote
          .save()
          .then((note) => res.json(note))
          .catch((err) => console.log(err));
      } else {
        res.json(creatingNoteValidatorResult.errors);
      }
    } else {
      return res.status(401).json({
        message: "You don't have permission to update this note",
      });
    }
  });
};

// Delete note
exports.deleteNote = (req, res) => {
  Note.findById(req.params.id).then((currentNote) => {
    if (currentNote.owner == req.user.id) {
      Note.findByIdAndDelete(req.params.id)
        .then(res.status(200).json({ success: "Success" }))
        .catch((err) => console.log(err));
    } else {
      return res.status(401).json({
        message: "You don't have permission to delete this note",
      });
    }
  });
};
