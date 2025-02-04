// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
