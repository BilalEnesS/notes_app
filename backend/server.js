const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('Server başlatılıyor...');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server çalışıyor!' });
});

console.log('Database import ediliyor...');
const { createTable } = require('./database');

console.log('Routes import ediliyor...');
const notesRoutes = require('./routes/notes');

// Routes
app.use('/api/notes', notesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Notes API is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error caught:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server başlat
const startServer = async () => {
  try {
    console.log('Tablo oluşturuluyor...');
    await createTable();
    console.log('Server dinleme moduna geçiyor...');
    app.listen(PORT, () => {
      console.log(`✅ Server http://localhost:${PORT} adresinde çalışıyor`);
      console.log(`Test için: http://localhost:${PORT}/test`);
    });
  } catch (err) {
    console.error('❌ Server başlatılamadı:', err);
    process.exit(1);
  }
};

startServer();