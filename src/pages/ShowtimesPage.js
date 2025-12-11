import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShowtimesPage.css';
import Header from '../components/Header';
const ShowtimePage = () => {
  const navigate = useNavigate();
  
  // Data tanggal
  const dates = [
    { date: "10 Dec", day: "SEN", fullDate: "2024-12-10" },
    { date: "11 Dec", day: "SEL", fullDate: "2024-12-11" },
    { date: "12 Dec", day: "RAB", fullDate: "2024-12-12" },
    { date: "13 Dec", day: "KAM", fullDate: "2024-12-13" },
    { date: "14 Dec", day: "JUM", fullDate: "2024-12-14" }
  ];

  // Data bioskop
  const cinemas = [
    { id: 1, name: "Gianna XXI", location: "Central Park Mall, Jakarta" },
    { id: 2, name: "Cinepolis", location: "Plaza Indonesia, Jakarta" },
    { id: 3, name: "XXI", location: "Grand Indonesia, Jakarta" }
  ];

  // Data film dengan gambar
  const movies = [
    {
      id: 1,
      title: "SPIDER-MAN: NO WAY HOME",
      duration: "3h 12m",
      rating: "4.8",
      genre: "Action, Adventure",
      ageRating: "13+",
      poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
      showtimes: [
        { time: "10:00", type: "REGULAR", price: 45000, available: true },
        { time: "13:30", type: "IMAX", price: 80000, available: true },
        { time: "17:00", type: "4DX", price: 120000, available: true },
        { time: "20:30", type: "PREMIERE", price: 150000, available: false }
      ]
    },
    {
      id: 2,
      title: "Jhon Wick 2",
      duration: "1h 59m",
      rating: "4.9",
      genre: "Action",
      ageRating: "17+",
      poster: "https://th.bing.com/th/id/OIP.m0WHztjn01Y2PyeUMF9mxwHaK2?pid=ImgDet&w=800&h=1150&rs=1",
      showtimes: [
        { time: "11:00", type: "REGULAR", price: 40000, available: true },
        { time: "14:00", type: "REGULAR", price: 45000, available: true },
        { time: "17:30", type: "SWEETBOX", price: 90000, available: true },
        { time: "20:00", type: "REGULAR", price: 50000, available: true }
      ]
    },
    {
      id: 3,
      title: "Joker",
      duration: "1h 59m",
      rating: "4.9",
      genre: "Action",
      ageRating: "17+",
      poster: "https://image.adsoftheworld.com/ukrohp55ai5bgkqjd292yelkceq5",
      showtimes: [
        { time: "11:00", type: "REGULAR", price: 40000, available: true },
        { time: "14:00", type: "REGULAR", price: 45000, available: true },
        { time: "17:30", type: "SWEETBOX", price: 90000, available: true },
        { time: "20:00", type: "REGULAR", price: 50000, available: true }
      ]
    }
  ];
  

  // State
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedCinema, setSelectedCinema] = useState(cinemas[0]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk handle pembelian tiket (MOCK VERSION)
  const handleBuyTicket = () => {
    if (!selectedMovie || !selectedShowtime) {
      alert('Silakan pilih film dan jam tayang terlebih dahulu!');
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock booking ID
      const mockBookingId = 'BK' + Date.now();
      
      // Navigate to checkout with data
      navigate('/checkout', {
        state: {
          booking_id: mockBookingId,
          movie: selectedMovie,
          cinema: selectedCinema,
          date: selectedDate,
          showtime: selectedShowtime,
          total_price: selectedShowtime.price,
          // Add mock transaction data
          transaction_id: 'TRX' + Date.now(),
          payment_status: 'pending'
        }
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleWatchTrailer = (movieTitle) => {
    // Bisa diganti dengan modal atau link YouTube
    const trailerLinks = {
      "SPIDER-MAN: NO WAY HOME": "https://www.youtube.com/watch?v=JfVOs4VSpmA",
      "Jhon Wick 2": "https://www.youtube.com/watch?v=XGk2EfbD_Ps",
      "Joker": "https://youtu.be/zAGVQLHvwOY?si=r8wmHwqCME2nkESC"
    };
    
    const link = trailerLinks[movieTitle];
    if (link) {
      window.open(link, '_blank');
    } else {
      alert(`Menampilkan trailer untuk: ${movieTitle}`);
    }
  };

  return (
    <div className="showtime-page">
      {/* Header */}
      
      <main className="showtime-container">
        {/* Page Header */}
        <div className="page-header">
          <h2>PILIH JADWAL TAYANG</h2>
          <p className="subtitle">Pilih tanggal, bioskop, dan jam tayang favorit Anda</p>
        </div>

        {/* Date Selection */}
        <div className="date-section">
          <h3 className="section-title">
            <span role="img" aria-label="calendar">📅</span> PILIH TANGGAL
          </h3>
          <div className="date-grid">
            {dates.map((date, index) => (
              <button
                key={index}
                className={`date-btn ${selectedDate.date === date.date ? 'active' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="date-day">{date.day}</div>
                <div className="date-number">{date.date.split(' ')[0]}</div>
                <div className="date-month">{date.date.split(' ')[1]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cinema Selection */}
        <div className="cinema-section">
          <h3 className="section-title">
            <span role="img" aria-label="cinema">🎬</span> PILIH BIOSKOP
          </h3>
          <div className="cinema-grid">
            {cinemas.map((cinema) => (
              <button
                key={cinema.id}
                className={`cinema-btn ${selectedCinema.id === cinema.id ? 'active' : ''}`}
                onClick={() => setSelectedCinema(cinema)}
              >
                <div className="cinema-name">{cinema.name}</div>
                <div className="cinema-location">{cinema.location}</div>
                {selectedCinema.id === cinema.id && (
                  <div className="selected-indicator">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Movies List */}
        <div className="movies-section">
          <div className="movies-header">
            <h3 className="section-title">
              <span role="img" aria-label="movie">🎞️</span> PILIH JAM TAYANG
            </h3>
            <div className="selected-info">
              <span className="info-item">
                <span role="img" aria-label="date">📅</span> {selectedDate.date}
              </span>
              <span className="info-item">
                <span role="img" aria-label="location">📍</span> {selectedCinema.name}
              </span>
            </div>
          </div>

          <div className="movies-count">
            <span role="img" aria-label="target">🎯</span> {movies.length} Film Tersedia
          </div>

          <div className="movies-list">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                {/* Movie Poster dan Info */}
                <div className="movie-header-with-poster">
                  <div className="movie-poster-container">
                    <img 
                      src={movie.poster} 
                      alt={`Poster ${movie.title}`}
                      className="movie-poster"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150x225?text=No+Poster";
                      }}
                    />
                    <div className="age-badge">{movie.ageRating}</div>
                  </div>
                  
                  <div className="movie-info">
                    <div className="movie-title-group">
                      <h4 className="movie-title">{movie.title}</h4>
                      <div className="movie-meta">
                        <span className="duration">
                          <span role="img" aria-label="clock">⏱️</span> {movie.duration}
                        </span>
                        <span className="rating">
                          <span role="img" aria-label="star">⭐</span> {movie.rating}
                        </span>
                        <span className="genre">{movie.genre}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="trailer-btn"
                      onClick={() => handleWatchTrailer(movie.title)}
                    >
                      <span role="img" aria-label="play">▶️</span> Tonton Trailer
                    </button>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="showtimes-section">
                  <h5 className="showtimes-title">Jadwal Tayang:</h5>
                  <div className="showtimes-grid">
                    {movie.showtimes.map((showtime, index) => (
                      <button
                        key={index}
                        className={`showtime-btn ${
                          selectedMovie?.id === movie.id && 
                          selectedShowtime?.time === showtime.time ? 'selected' : ''
                        } ${!showtime.available ? 'sold-out' : ''}`}
                        onClick={() => {
                          if (showtime.available) {
                            setSelectedMovie(movie);
                            setSelectedShowtime(showtime);
                          }
                        }}
                        disabled={!showtime.available}
                      >
                        <div className="showtime-time">{showtime.time}</div>
                        <div className="showtime-type">{showtime.type}</div>
                        <div className="showtime-price">Rp {showtime.price.toLocaleString()}</div>
                        {!showtime.available && (
                          <div className="sold-out-badge">HABIS</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        {selectedMovie && selectedShowtime && (
          <div className="action-footer">
            <div className="selection-summary">
              <div className="summary-left">
                <div className="selected-movie-with-poster">
                  <img 
                    src={selectedMovie.poster} 
                    alt={`Poster ${selectedMovie.title}`}
                    className="selected-movie-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50x75?text=Poster";
                    }}
                  />
                  <div>
                    <h4>Pilihan Anda:</h4>
                    <div className="selected-details">
                      <span className="movie-title">{selectedMovie.title}</span>
                      <span className="separator">•</span>
                      <span className="showtime">{selectedShowtime.time}</span>
                      <span className="separator">•</span>
                      <span className="cinema">{selectedCinema.name}</span>
                      <span className="separator">•</span>
                      <span className="date">{selectedDate.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="summary-right">
                <div className="price-info">
                  <span className="price-label">Total:</span>
                  <span className="price-amount">Rp {selectedShowtime.price.toLocaleString()}</span>
                </div>
                <button 
                  className="buy-btn" 
                  onClick={handleBuyTicket}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> MEMPROSES...
                    </>
                  ) : (
                    'BELI TIKET SEKARANG →'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShowtimePage;