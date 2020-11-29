const mongoose = require("mongoose");
const schema = mongoose.Schema;

const NoteSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = Note = mongoose.model("note", NoteSchema, "note");
