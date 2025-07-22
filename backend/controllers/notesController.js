
const { pool } = require('../database');

// Tüm notları getir
const getAllNotes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notes ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notlar getirilemedi' });
  }
};

// ID ile not getir
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Not getirilemedi' });
  }
};

// Yeni not oluştur
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Başlık gerekli' });
    }
    
    const result = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Not oluşturulamadı' });
  }
};

// Not güncelle
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Başlık gerekli' });
    }
    
    const result = await pool.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content || '', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not bulunamadı' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Not güncellenemedi' });
  }
};

// Not sil
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not bulunamadı' });
    }
    
    res.json({ message: 'Not silindi', note: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Not silinemedi' });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};