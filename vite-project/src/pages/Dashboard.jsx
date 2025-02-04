import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStickyNote, FaStar, FaPlus, FaTrash, FaCopy } from 'react-icons/fa';

function Dash() {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [newNote, setNewNote] = useState({ heading: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    axios.get('https://notes-taking-pro.onrender.com/create/notes')
      .then(response => {
        setNotes(response.data);
        setFavorites(response.data.filter(note => note.favorite));
      })
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const deleteNote = (id) => {
    axios.delete(`https://notes-taking-pro.onrender.com/create/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
        setFavorites(favorites.filter(note => note._id !== id));
        setCurrentNote(null);
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  const toggleFavorite = (id) => {
    const note = notes.find(note => note._id === id);
    const updatedNote = { ...note, favorite: !note.favorite };

    axios.put(`https://notes-taking-pro.onrender.com/create/notes/${id}`, updatedNote)
      .then(response => {
        setNotes(notes.map(note => (note._id === id ? response.data : note)));
        if (response.data.favorite) {
          setFavorites([...favorites, response.data]);
        } else {
          setFavorites(favorites.filter(note => note._id !== id));
        }
      })
      .catch(error => console.error('Error updating favorite status:', error));
  };

  const editNote = () => {
    axios.put(`https://notes-taking-pro.onrender.com/create/notes/${currentNote._id}`, currentNote)
      .then(response => {
        setNotes(notes.map(note => (note._id === currentNote._id ? response.data : note)));
        setCurrentNote(response.data);
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          setShowPopup(false);  // Close the popup after saving
        }, 1500);
      })
      .catch(error => console.error('Error editing note:', error));
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleCreateNote = () => {
    if (!newNote.heading || !newNote.content) {
      alert('Both heading and content are required!');
      return;
    }
    axios.post('https://notes-taking-pro.onrender.com/create/notes', newNote)
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ heading: '', content: '' });
        setShowPopup(false);  // Close the popup after creating the note
      })
      .catch(error => console.error('Error creating note:', error));
  };

  const filteredNotes = notes.filter(
    note => note.heading.toLowerCase().includes(searchQuery.toLowerCase()) || 
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => setActiveTab('notes')} className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${activeTab === 'notes' ? 'bg-gray-700' : ''}`}>
            <FaStickyNote />
            <span>Notes</span>
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${activeTab === 'favorites' ? 'bg-gray-700' : ''}`}>
            <FaStar />
            <span>Favorites</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-100 relative">
        {activeTab === 'notes' ? (
          <div>
            <h1 className="text-3xl font-semibold mb-4">Your Notes</h1>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full p-3 mb-6 bg-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-4 grid grid-cols-4 gap-4">
              {filteredNotes.map(note => (
                <div key={note._id} className="p-4 bg-white shadow rounded-lg relative h-40 cursor-pointer"
                  onClick={() => setCurrentNote(note)}>
                  <h2 className="font-bold text-sm">{note.heading}</h2>
                  <p className="text-xs overflow-hidden h-16">{note.content}</p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }} className="text-red-500 hover:text-red-700 p-1 rounded-md text-xs"><FaTrash /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id); }} 
                            className={`text-xl ${note.favorite ? 'text-yellow-400' : 'text-black'}`}>
                      <FaStar />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopup(true)} className="absolute bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600">
              <FaPlus />
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold">Your Favorites</h1>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {favorites.map(note => (
                <div key={note._id} className="p-4 bg-white shadow rounded-lg relative h-40 cursor-pointer"
                  onClick={() => setCurrentNote(note)}>
                  <h2 className="font-bold text-sm">{note.heading}</h2>
                  <p className="text-xs overflow-hidden h-16">{note.content}</p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }} className="text-red-500 hover:text-red-700 p-1 rounded-md text-xs"><FaTrash /></button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id); }} 
                            className={`text-xl ${note.favorite ? 'text-yellow-400' : 'text-black'}`}>
                      <FaStar />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Note Popup Modal */}
      {(showPopup || currentNote) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white p-12 rounded-xl shadow-lg w-1/2 transform transition-transform duration-300 ease-in-out max-h-[80%] overflow-y-auto">
            {currentNote ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-8">
                  <input
                    type="text"
                    value={currentNote.heading}
                    onChange={(e) => setCurrentNote({ ...currentNote, heading: e.target.value })}
                    className="w-full text-center p-4 border border-gray-300 rounded-lg mb-4"
                  />
                </h2>
                <textarea
                  value={currentNote.content}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none"
                  rows="12"
                ></textarea>
                {isSaved && <p className="text-green-500 text-center mb-4">Saved!</p>}
                <div className="flex justify-between items-center">
                  <button onClick={() => setCurrentNote(null)} className="bg-gray-300 text-gray-800 p-2 rounded-lg w-32 hover:bg-gray-400 text-xs">
                    Close
                  </button>
                  <button onClick={() => copyToClipboard(currentNote.content)} className="bg-blue-500 text-white p-2 rounded-lg w-32 hover:bg-blue-600 text-xs">
                    <FaCopy /> Copy
                  </button>
                  <button onClick={editNote} className="bg-blue-500 text-white p-2 rounded-lg w-32 hover:bg-blue-600 text-xs">
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-8">Create New Note</h2>
                <input
                  type="text"
                  placeholder="Heading"
                  value={newNote.heading}
                  onChange={(e) => setNewNote({ ...newNote, heading: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                />
                <textarea
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg mb-4 resize-none"
                  rows="12"
                ></textarea>
                <div className="flex justify-between items-center">
                  <button onClick={() => setShowPopup(false)} className="bg-gray-300 text-gray-800 p-2 rounded-lg w-32 hover:bg-gray-400 text-xs">
                    Close
                  </button>
                  <button onClick={handleCreateNote} className="bg-blue-500 text-white p-2 rounded-lg w-32 hover:bg-blue-600 text-xs">
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dash;
