import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Moon, Sun, Save, X, CheckSquare, Square } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API calls
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError('Error loading notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      const url = editingNote 
        ? `${API_BASE_URL}/notes/${editingNote.id}`
        : `${API_BASE_URL}/notes`;
      
      const method = editingNote ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to save note');
      
      await fetchNotes();
      setShowModal(false);
      setEditingNote(null);
      setFormData({ title: '', content: '' });
    } catch (err) {
      setError('Error saving note');
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      await fetchNotes();
    } catch (err) {
      setError('Error deleting note');
      console.error(err);
    }
  };

  // Toggle completed status
  const toggleCompleted = async (note) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          completed: !note.completed
        })
      });
      if (!response.ok) throw new Error('Failed to update note');
      await fetchNotes();
    } catch (err) {
      setError('Error updating note');
      console.error(err);
    }
  };

  // Event handlers
  const handleNewNote = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content || '', completed: note.completed });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filtered notes
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Dark mode class
  const containerClass = darkMode 
    ? 'min-h-screen bg-gray-900 text-white transition-all duration-300' 
    : 'min-h-screen bg-gray-50 text-gray-900 transition-all duration-300';

  const cardClass = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const inputClass = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  if (loading) {
    return (
      <div className={`${containerClass} flex items-center justify-center`}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">📝 My Notes</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleNewNote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl mb-2">
              {searchTerm ? 'No notes found for your search.' : 'No notes yet.'}
            </p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {!searchTerm && 'Click "New Note" to add your first note.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`border rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${cardClass}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompleted(note)}
                      className={`p-1 rounded ${note.completed ? 'text-green-600' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      title={note.completed ? 'Mark as not done' : 'Mark as done'}
                    >
                      {note.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                    <h3 className={`font-semibold text-lg truncate pr-2 ${note.completed ? 'line-through text-gray-400' : ''}`}>
                      {note.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className={`p-1 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 hover:bg-opacity-80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className={`text-sm mb-3 line-clamp-3 ${note.completed ? 'line-through text-gray-400' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {note.content}
                  </p>
                )}
                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(note.updated_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-md rounded-lg p-6 ${cardClass}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingNote ? 'Edit Note' : 'New Note'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className={`p-1 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
                />
                <textarea
                  placeholder="Note content..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${inputClass}`}
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCloseModal}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={!formData.title.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;