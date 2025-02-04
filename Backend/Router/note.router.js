// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../Controller/note.controller');

// Create a new note
router.post('/notes', createNote);

// Get all notes
router.get('/notes', getNotes);

// Get a specific note by ID
router.get('/notes/:id', getNote);

// Update a note by ID
router.put('/notes/:id', updateNote);

// Delete a note by ID
router.delete('/notes/:id', deleteNote);

module.exports = router;
