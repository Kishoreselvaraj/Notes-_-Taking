import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDelete, MdEdit, MdFavorite } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteData, setNoteData] = useState({ topic: "", text: "", favorite: false });
  const [editId, setEditId] = useState(null);

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/create/notes");
        console.log("Fetched notes:", response.data); // Log the fetched notes
        if (Array.isArray(response.data)) {
          setNotes(response.data);
        } else {
          console.error("Fetched data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Handle saving a new or edited note
  const handleSaveNote = async () => {
    if (!noteData.text.trim() || !noteData.topic.trim()) return;

    try {
      if (editId) {
        // Update note
        const updatedNote = { ...noteData };
        await axios.put(`http://localhost:3000/create/notes/${editId}`, updatedNote);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === editId ? { ...note, ...noteData } : note))
        );
        setEditId(null);
      } else {
        // Create a new note
        const newNote = { ...noteData, id: uuidv4() };
        console.log("New Note:", newNote); // Log the new note
        await axios.post("http://localhost:3000/create/notes", newNote);
        setNotes((prevNotes) => [newNote, ...prevNotes]);
      }
      setNoteData({ topic: "", text: "", favorite: false });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/create/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Handle editing a note
  const handleEditNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (!noteToEdit) return;
    setNoteData({ topic: noteToEdit.topic, text: noteToEdit.text, favorite: noteToEdit.favorite });
    setEditId(id);
    setIsModalOpen(true);
  };

  // Handle toggling favorite status
  const toggleFavorite = async (id) => {
    try {
      const noteToUpdate = notes.find((note) => note.id === id);
      if (!noteToUpdate) return;
      const updatedNote = { ...noteToUpdate, favorite: !noteToUpdate.favorite };
      await axios.put(`http://localhost:3000/create/notes/${id}`, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-1/4 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">AI Notes</h2>
        <button className="w-full text-left p-2 bg-purple-100 rounded-lg mb-2">Home</button>
        <button className="w-full text-left p-2">Favourites</button>
      </aside>
      <div className="w-3/4 p-6">
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full p-2 border rounded-md"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.isArray(notes) && notes.length > 0 ? (
            notes
              .filter((note) =>
                note.text && note.text.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => {
                console.log("Rendering note:", note); // Debugging line to see individual notes
                return (
                  <div
                    key={note.id}
                    className="p-4 border rounded-md shadow-md flex flex-col h-40 overflow-hidden"
                  >
                    <h3 className="font-bold truncate">{note.topic}</h3>
                    <p className="text-sm text-gray-600 truncate">{note.text.substring(0, 50)}...</p>
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="text-left truncate w-full mt-2 text-gray-600 hover:text-gray-800"
                    >
                      View Note
                    </button>
                    <div className="flex justify-between mt-auto">
                      <button onClick={() => handleEditNote(note.id)}>
                        <MdEdit />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)}>
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => toggleFavorite(note.id)}
                        className={note.favorite ? "text-red-500" : "text-gray-500"}
                      >
                        <MdFavorite />
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <p>No notes found. Please try again later.</p>
          )}
        </div>
        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus size={24} />
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-full">
              <h2 className="text-xl font-bold mb-4">{editId ? "Edit Note" : "New Note"}</h2>
              <input
                type="text"
                placeholder="Topic"
                className="w-full p-3 border rounded-md mb-3"
                value={noteData.topic}
                onChange={(e) => setNoteData({ ...noteData, topic: e.target.value })}
              />
              <textarea
                rows="6"
                className="w-full p-3 border rounded-md mb-3"
                placeholder="Write your note here..."
                value={noteData.text}
                onChange={(e) => setNoteData({ ...noteData, text: e.target.value })}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="p-3 border rounded-md">
                  Cancel
                </button>
                <button onClick={handleSaveNote} className="bg-blue-500 text-white p-3 rounded-md">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
