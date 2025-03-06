import React, { useState, useEffect } from 'react';
import PreferencesForm from './components/PreferencesForm';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';
import MovieDetail from './components/MovieDetail';
import MovieCard from './components/MovieCard';
import apiService from './services/api';
import './App.css';

// Replace with your actual API key
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Set the API key in the api module
apiService.API_KEY = API_KEY;

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState({});
  const [activeView, setActiveView] = useState('recommendations'); // 'recommendations' or 'search'

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY') {
          throw new Error('Please set your TMDB API key in .env file');
        }

        const movieGenres = await apiService.getGenres('movie');
        const tvGenres = await apiService.getGenres('tv');

        const genreMap = {};
        movieGenres.genres.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        tvGenres.genres.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });

        setGenres(genreMap);

        const trendingData = await apiService.getTrending('all', 'week');
        setRecommendations(trendingData.results);
        setLoading(false);
      } catch (err) {
        console.error('Error during initial data fetch:', err);
        setError(`Setup error: ${err.message}`);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const results = await apiService.searchMedia(query, 'movie');
      setSearchResults(results.results);
      setActiveView('search'); // Switch to search results view
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error during search:", err);
      setError("Failed to fetch movies. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmitPreferences = async (preferences) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching recommendations with preferences:', preferences);
      const data = await apiService.getRecommendations(preferences);

      if (!data.results || data.results.length === 0) {
        setError('No results found for these preferences. Try broadening your criteria.');
        setRecommendations([]);
      } else {
        setRecommendations(data.results);
        setActiveView('recommendations'); // Switch to recommendations view
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(`Error: ${err.message}`);
      setRecommendations([]);
      setLoading(false);
    }
  };

  const handleSelectItem = async (item) => {
    if (!item) return;

    try {
      // Determine the media type (default to 'movie' if not specified)
      const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
      
      // Fetch the details using the correct media type
      const details = await apiService.getDetails(item.id, mediaType);

      // Format the details for the MovieDetail component
      const formattedDetails = {
        // Keep the original item data
        ...item,
        // Add or override with detailed information
        title: details.title || details.name,
        releaseDate: details.release_date || details.first_air_date,
        // Don't construct the full URL here - just pass the poster_path
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        director: details.credits?.crew?.find(member => member.job === 'Director')?.name || "Unknown",
        genres: details.genres ? details.genres.map(g => g.name) : [],
        runtime: details.runtime || details.episode_run_time?.[0],
        vote_average: details.vote_average,
        overview: details.overview,
        cast: details.credits?.cast ? details.credits.cast.slice(0, 10).map(actor => actor.name) : [],
      };

      setSelectedItem(formattedDetails); // Store detailed movie info
    } catch (error) {
      console.error("Error fetching item details:", error);
      setError("Could not load details. Please try again.");
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null); // Close the MovieDetails modal
  };

  // Function to map genre IDs to names for the MovieCard component
  const getGenreNames = (genreIds) => {
    if (!genreIds) return [];
    return genreIds.map(id => genres[id] || `Genre ${id}`);
  };

  // Enhanced movie data with genre names
  const getEnhancedMovieData = (movies) => {
    return movies.map(movie => ({
      ...movie,
      genreNames: getGenreNames(movie.genre_ids)
    }));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">The Next Flick 🎥📼🍿</h1>
      </header>

      <main className="main-content">
        {API_KEY === 'YOUR_TMDB_API_KEY' && (
          <div className="api-warning">
            <p className="warning-title">API Key Missing</p>
            <p>Please set your TMDB API key in the .env file as REACT_APP_TMDB_API_KEY=your_key_here</p>
          </div>
        )}

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Preferences Form */}
        <PreferencesForm onSubmitPreferences={handleSubmitPreferences} />

        {/* Show detailed view or list view */}
        {selectedItem ? (
          <MovieDetail movie={selectedItem} onClose={handleCloseDetails} />
        ) : (
          <section className="content-section">
            {/* View Selection Tabs */}
            {searchResults.length > 0 && (
              <div className="view-tabs">
                <button 
                  className={`tab-button ${activeView === 'recommendations' ? 'active' : ''}`}
                  onClick={() => setActiveView('recommendations')}
                >
                  Recommendations
                </button>
                <button 
                  className={`tab-button ${activeView === 'search' ? 'active' : ''}`}
                  onClick={() => setActiveView('search')}
                >
                  Search Results
                </button>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
                {activeView === 'search' && searchResults.length > 0 ? (
                  <MovieList 
                    movies={getEnhancedMovieData(searchResults)} 
                    onSelectMovie={handleSelectItem} 
                    isLoading={loading} 
                    error={error} 
                  />
                ) : (
                  <>
                    <div className="movie-list-container">
                      <h2>
                        {recommendations.length > 0 
                          ? 'Recommended For You' 
                          : 'Start by searching or selecting your preferences'}
                      </h2>

                      <div className="movie-list-grid">
                        {getEnhancedMovieData(recommendations).map((item) => (
                          <MovieCard key={item.id} item={item} onSelect={handleSelectItem} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Data provided by TMDB</p>
      </footer>
    </div>
  );
}

export default App;