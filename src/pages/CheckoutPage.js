import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

// Konstanta untuk biaya layanan
const SERVICE_FEE = 5000; 

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State untuk data booking dan informasi transaksi
    const [bookingData, setBookingData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    // State baru untuk menyimpan ID transaksi dari server
    const [transactionDetails, setTransactionDetails] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false); // State untuk Syarat & Ketentuan
    const [step, setStep] = useState(1); // 1: Info, 2: Pembayaran, 3: Konfirmasi

    useEffect(() => {
        if (location.state) {
            setBookingData(location.state);
        } else {
            // Jika tidak ada data, redirect ke halaman showtimes
            navigate('/showtimes');
        }
    }, [location, navigate]);

    // --- FUNGSI BARU: MENGIRIM DATA KE BACKEND API ---
    const handlePayment = async () => {
        // Validasi data diri di Step 2 (sebelumnya di Step 1)
        if (!userInfo.name || !userInfo.email || !userInfo.phone) {
            alert('Harap lengkapi informasi pribadi Anda');
            return;
        }

        // Validasi persetujuan di Step 2
        if (step === 2 && !termsAgreed) {
            alert('Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Privasi.');
            return;
        }

        setLoading(true);

        const totalAmount = bookingData.total_price + SERVICE_FEE;

        const bookingPayload = {
            movie: bookingData.movie,
            cinema: bookingData.cinema,
            date: bookingData.date,
            showtime: bookingData.showtime,
            total_price: bookingData.total_price, // Harga tiket saja
            service_fee: SERVICE_FEE,
            customer_name: userInfo.name,
            customer_email: userInfo.email,
            customer_phone: userInfo.phone,
            payment_method: paymentMethod,
            total_amount: totalAmount,
            // Asumsi kursi belum dipilih, kirim nilai default
            seat_details: [] 
        };

        try {
            // Ganti URL dengan alamat server Express Anda
            const response = await fetch('http://localhost:3001/api/create-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingPayload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Pembayaran dan pemesanan berhasil
                setTransactionDetails({
                    transactionId: data.transactionId,
                    totalPaid: data.totalPaid,
                    method: paymentMethod
                });
                setStep(3); // Pindah ke step konfirmasi
                // Tidak perlu lagi alert di sini, karena konfirmasi akan ditampilkan di Step 3
            } else {
                // Penanganan kesalahan dari server
                alert(`❌ Pembayaran Gagal: ${data.message || 'Terjadi kesalahan saat memproses pembayaran.'}`);
            }

        } catch (error) {
            console.error('Error saat melakukan pembayaran:', error);
            alert('❌ Terjadi kesalahan jaringan. Mohon cek koneksi server.');
        } finally {
            setLoading(false);
        }
    };
    // --- AKHIR FUNGSI BARU ---

    const handleSeatSelection = () => {
        alert('Fitur pemilihan kursi akan tersedia di versi selanjutnya!');
    };

    if (!bookingData) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data pemesanan...</p>
            </div>
        );
    }

    // Total harga yang sudah termasuk biaya layanan
    const finalPrice = bookingData.total_price + SERVICE_FEE;
    
    return (
        <div className="checkout-page">
            <div className="container">
                {/* Header */}
                <header className="checkout-header">
                    <button className="back-btn" onClick={() => navigate('/showtimes')}>
                        ← Kembali
                    </button>
                    <h1>Checkout Tiket</h1>
                    <div className="step-indicator">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Info</div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Bayar</div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Selesai</div>
                    </div>
                </header>

                <div className="checkout-content">
                    {/* Left Column - Movie Details */}
                    <div className="checkout-left">
                        {/* ... (Detail Film dan Pemesanan sama seperti sebelumnya) ... */}
                        <div className="movie-summary-card">
                            {/* ... (Movie Header) ... */}
                            <div className="movie-header">
                                <img 
                                    src={bookingData.movie.poster} 
                                    alt={bookingData.movie.title}
                                    className="movie-poster-large"
                                />
                                <div className="movie-info-large">
                                    <h2>{bookingData.movie.title}</h2>
                                    <div className="movie-meta-large">
                                        <span><strong>Durasi:</strong> {bookingData.movie.duration}</span>
                                        <span><strong>Genre:</strong> {bookingData.movie.genre}</span>
                                        <span><strong>Rating:</strong> ⭐ {bookingData.movie.rating}</span>
                                        <span><strong>Klasifikasi:</strong> {bookingData.movie.ageRating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-details-card">
                                <h3>Detail Pemesanan</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="label">Bioskop:</span>
                                        <span className="value">{bookingData.cinema.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Lokasi:</span>
                                        <span className="value">{bookingData.cinema.location}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Tanggal:</span>
                                        <span className="value">{bookingData.date.date}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Jam Tayang:</span>
                                        <span className="value">{bookingData.showtime.time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Tipe Studio:</span>
                                        <span className="value">{bookingData.showtime.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Kursi:</span>
                                        <span className="value">
                                            <button className="seat-select-btn" onClick={handleSeatSelection}>
                                                Pilih Kursi
                                            </button>
                                        </span>
                                    </div>
                                </div>

                                <div className="price-summary">
                                    <div className="price-item">
                                        <span>Harga Tiket (1x):</span>
                                        <span>Rp {bookingData.total_price.toLocaleString()}</span>
                                    </div>
                                    <div className="price-item">
                                        <span>Biaya Layanan:</span>
                                        <span>Rp {SERVICE_FEE.toLocaleString()}</span>
                                    </div>
                                    <div className="price-item total">
                                        <span>Total Pembayaran:</span>
                                        <span className="total-price">
                                            Rp {finalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Steps */}
                    <div className="checkout-right">
                        {step === 1 && (
                            <div className="payment-section">
                                <h2>Data Diri Pemesan</h2>
                                {/* ... (Form data diri sama seperti sebelumnya) ... */}
                                <p className="section-subtitle">Pastikan data yang diisi sesuai dan valid</p>
                                
                                <div className="form-group">
                                    <label>Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        value={userInfo.name}
                                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        placeholder="contoh@email.com"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Nomor Telepon *</label>
                                    <input
                                        type="tel"
                                        placeholder="08xxxxxxxxxx"
                                        value={userInfo.phone}
                                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <button 
                                    className="btn-next"
                                    onClick={() => {
                                        if (userInfo.name && userInfo.email && userInfo.phone) {
                                            setStep(2);
                                        } else {
                                            alert('Harap lengkapi semua data diri terlebih dahulu');
                                        }
                                    }}
                                >
                                    Lanjut ke Pembayaran →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="payment-section">
                                <h2>Pilih Metode Pembayaran</h2>
                                <p className="section-subtitle">Pilih metode yang paling nyaman untuk Anda</p>
                                
                                {/* ... (Pilihan Metode Pembayaran sama seperti sebelumnya) ... */}
                                <div className="payment-methods">
                                    <div className="payment-option">
                                        <label className={paymentMethod === 'credit_card' ? 'active' : ''}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="credit_card"
                                                checked={paymentMethod === 'credit_card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-icon">💳</div>
                                            <div className="payment-info">
                                                <span className="payment-name">Kartu Kredit/Debit</span>
                                                <span className="payment-desc">VISA, MasterCard, JCB</span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="payment-option">
                                        <label className={paymentMethod === 'qris' ? 'active' : ''}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="qris"
                                                checked={paymentMethod === 'qris'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-icon">📱</div>
                                            <div className="payment-info">
                                                <span className="payment-name">QRIS</span>
                                                <span className="payment-desc">Scan QR dengan e-wallet</span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="payment-option">
                                        <label className={paymentMethod === 'bank_transfer' ? 'active' : ''}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="bank_transfer"
                                                checked={paymentMethod === 'bank_transfer'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-icon">🏦</div>
                                            <div className="payment-info">
                                                <span className="payment-name">Transfer Bank</span>
                                                <span className="payment-desc">BCA, Mandiri, BRI, BNI</span>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="payment-option">
                                        <label className={paymentMethod === 'ovo' ? 'active' : ''}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="ovo"
                                                checked={paymentMethod === 'ovo'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="payment-icon">📲</div>
                                            <div className="payment-info">
                                                <span className="payment-name">OVO</span>
                                                <span className="payment-desc">Bayar dengan OVO</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Menggunakan state termsAgreed */}
                                <div className="terms-agreement">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={termsAgreed}
                                            onChange={(e) => setTermsAgreed(e.target.checked)}
                                            required 
                                        />
                                        <span>Saya setuju dengan <a href="/terms">Syarat dan Ketentuan</a> serta <a href="/privacy">Kebijakan Privasi</a> yang berlaku</span>
                                    </label>
                                </div>
                                
                                <button 
                                    className="btn-pay"
                                    onClick={handlePayment}
                                    disabled={loading || !termsAgreed} // Disable jika loading atau belum setuju
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-small"></span> Memproses Pembayaran...
                                        </>
                                    ) : (
                                        `BAYAR Rp ${finalPrice.toLocaleString()}`
                                    )}
                                </button>
                            </div>
                        )}

                        {step === 3 && transactionDetails && (
                            <div className="confirmation-section">
                                <div className="success-icon">✅</div>
                                <h2>Pembayaran Berhasil!</h2>
                                <p className="success-message">
                                    Tiket Anda telah berhasil dipesan dan akan dikirim ke email:
                                    <strong> {userInfo.email}</strong>
                                </p>
                                
                                <div className="confirmation-details">
                                    <div className="detail-row">
                                        <span>ID Transaksi:</span>
                                        {/* Menggunakan ID Transaksi dari server */}
                                        <span className="transaction-id">{transactionDetails.transactionId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Metode Pembayaran:</span>
                                        <span>{
                                            transactionDetails.method === 'credit_card' ? 'Kartu Kredit/Debit' : 
                                            transactionDetails.method === 'qris' ? 'QRIS' :
                                            transactionDetails.method === 'bank_transfer' ? 'Transfer Bank' : 'OVO'
                                        }</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Total Dibayar:</span>
                                        {/* Menggunakan Total Dibayar dari server */}
                                        <span className="total-paid">Rp {transactionDetails.totalPaid.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <div className="confirmation-actions">
                                    <button className="btn-download" onClick={() => alert('Fitur download tiket akan tersedia')}>
                                        📥 Download E-Ticket
                                    </button>
                                    <button className="btn-home" onClick={() => navigate('/')}>
                                        🏠 Kembali ke Beranda
                                    </button>
                                </div>
                            </div>
                        )}
                         {step === 3 && !transactionDetails && (
                            <div className="loading-container">
                                <h2>Memuat Konfirmasi...</h2>
                                <p>Jika halaman ini tidak berubah, terjadi kesalahan pada transaksi.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;