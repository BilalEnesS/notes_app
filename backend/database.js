const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Veritabanı tablosunu oluştur
const createTable = async () => {
  // Create table if not exists
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed BOOLEAN DEFAULT FALSE
      )
    `);
    // Add completed column if it doesn't exist (for migration)
    await pool.query(`ALTER TABLE notes ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;`);
    console.log('Notes table is ready (with completed column)');
  } catch (err) {
    console.error('Table creation error:', err);
    throw err;
  }
};

module.exports = {
  pool,
  createTable
};