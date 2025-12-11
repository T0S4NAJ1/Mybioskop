// db.js

const mysql = require('mysql2');

// Sesuaikan konfigurasi ini dengan detail MySQL Anda
// db.js
const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',           
    password: '', // ⬅️ Pastikan ini benar
    database: 'movieticket_db', 
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('✅ Terhubung ke database MySQL dengan ID:', db.threadId);
});

module.exports = db;