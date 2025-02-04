// controllers/noteController.js
const Note = require('../Models/notes.model');

// Create a new note
const createNote = async (req, res) => {
  const { heading, content, favorite } = req.body;
  try {
    const newNote = new Note({
      heading,
      content,
      favorite: favorite || false,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note', error });
  }
};

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching notes', error });
  }
};

// Get a single note by ID
const getNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching note', error });
  }
};

// Update a note by ID
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { heading, content, favorite } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, {
      heading,
      content,
      favorite,
    }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: 'Error updating note', error });
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting note', error });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
