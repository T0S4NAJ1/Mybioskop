const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Impor koneksi database

const app = express();
const PORT = 3001; 

app.use(cors()); 
app.use(bodyParser.json()); 

// Fungsi untuk membuat ID Transaksi unik
const generateTransactionId = () => 'TRX' + Date.now() + Math.floor(Math.random() * 1000);

// --- ENDPOINT PEMESANAN ---
app.post('/api/create-booking', async (req, res) => {
    const bookingPayload = req.body;
    const { movie, cinema, date, showtime, customer_name, customer_email, customer_phone, payment_method } = bookingPayload;
    
    // Hitung total akhir
    const SERVICE_FEE = 5000;
    const totalAmount = bookingPayload.total_price + SERVICE_FEE;
    const transactionId = generateTransactionId();

    // 1. QUERY UNTUK MEMASUKKAN KE TABEL BOOKINGS
    const bookingQuery = `
        INSERT INTO Bookings (
            transaction_id, customer_name, customer_email, customer_phone, 
            movie_title, cinema_name, show_date, show_time, studio_type, 
            ticket_price, service_fee, total_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const bookingValues = [
        transactionId,
        customer_name,
        customer_email,
        customer_phone,
        movie.title,
        cinema.name,
        date.date, // Pastikan format tanggal sesuai dengan tipe DATE MySQL (YYYY-MM-DD)
        showtime.time,
        showtime.type,
        bookingPayload.total_price,
        SERVICE_FEE,
        totalAmount,
        'PAID' // Asumsi pembayaran berhasil
    ];

    // 2. QUERY UNTUK MEMASUKKAN KE TABEL PAYMENTS
    const paymentQuery = `
        INSERT INTO Payments (booking_ref_id, method, amount_paid, payment_status)
        VALUES (?, ?, ?, ?)
    `;
    const paymentValues = [
        transactionId,
        payment_method,
        totalAmount,
        'SUCCESS'
    ];

    try {
        // Gunakan promise wrapper untuk query agar bisa menggunakan async/await
        const queryPromise = (sql, values) => {
            return new Promise((resolve, reject) => {
                db.query(sql, values, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        };

        // Mulai transaksi database (PENTING untuk menjaga integritas data)
        await queryPromise('START TRANSACTION');

        await queryPromise(bookingQuery, bookingValues);
        await queryPromise(paymentQuery, paymentValues);

        await queryPromise('COMMIT'); // Commit jika kedua query berhasil

        console.log(`✅ Pemesanan & Pembayaran Berhasil Disimpan. ID: ${transactionId}`);
        
        // Kirim respons sukses kembali ke frontend
        return res.status(200).json({
            success: true,
            message: 'Pembayaran dan pemesanan berhasil diproses.',
            transactionId: transactionId,
            totalPaid: totalAmount 
        });

    } catch (error) {
        // Jika ada kesalahan, batalkan semua perubahan
        await queryPromise('ROLLBACK'); 
        console.error('❌ Database Error (ROLLBACK executed):', error);
        
        return res.status(500).json({
            success: false,
            message: 'Gagal menyimpan transaksi. Terjadi kesalahan internal server.',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server API berjalan di http://localhost:${PORT}`);
});