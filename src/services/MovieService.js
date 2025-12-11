const API_BASE_URL = 'http://localhost:3000/api';

export const movieService = {
    // Get all movies
    async getMovies() {
        const response = await fetch(`${API_BASE_URL}/movies`);
        return response.json();
    },

    // Get movie by ID
    async getMovieById(id) {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`);
        return response.json();
    },

    // Get showtimes by movie ID
    async getShowtimesByMovie(movieId) {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}/showtimes`);
        return response.json();
    },

    // Get cinemas
    async getCinemas() {
        const response = await fetch(`${API_BASE_URL}/cinemas`);
        return response.json();
    },

    // Get showtimes by cinema
    async getShowtimesByCinema(cinemaId, date) {
        const response = await fetch(`${API_BASE_URL}/cinemas/${cinemaId}/showtimes?date=${date}`);
        return response.json();
    },

    // Create booking
    async createBooking(bookingData) {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        return response.json();
    }
};