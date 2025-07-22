const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/notesController');

// GET /api/notes - Tüm notları getir
router.get('/', getAllNotes);

// GET /api/notes/:id - ID ile not getir
router.get('/:id', getNoteById);

// POST /api/notes - Yeni not oluştur
router.post('/', createNote);

// PUT /api/notes/:id - Not güncelle
router.put('/:id', updateNote);

// DELETE /api/notes/:id - Not sil
 router.delete('/:id', deleteNote);

module.exports = router;