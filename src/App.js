import React, { useState, useEffect } from 'react';
import PreferencesForm from './components/PreferencesForm';
import MovieCard from './components/MovieCard';
import apiService from './services/api';
import SearchBar from './components/SearchBar';
import MovieDetails from './components/MovieDetail'; // Correct import

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
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY') {
          throw new Error('Please set your TMDB API key in App.js');
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
      const results = await apiService.searchMedia(query, 'movie');
      setSearchResults(results.results);
      setError(null);
    } catch (err) {
      console.error("Error during search:", err);
      setError("Failed to fetch movies. Please try again.");
    }
  };

  const handleMovieClick = async (movieId) => {
    try {
      const details = await apiService.getDetails(movieId, 'movie');

      // Map API response to the format expected by MovieDetails
      const movieData = {
        title: details.title,
        releaseDate: details.release_date,
        poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
        director: details.credits.crew.find(member => member.job === 'Director')?.name || "Unknown",
        genres: details.genres.map(g => g.name),
        runtime: details.runtime,
        rating: details.vote_average,
        plot: details.overview,
        cast: details.credits.cast.slice(0, 10).map(actor => actor.name) // limit to 10 actors
      };

      setSelectedMovie(movieData); // Set movie details
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError("Could not fetch movie details."); // Handle errors
    }
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null); // Close the MovieDetails modal
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
      const details = await apiService.getDetails(item.id, item.media_type || 'movie');
  
      const formattedDetails = {
        title: details.title || details.name,
        releaseDate: details.release_date || details.first_air_date,
        poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
        director: details.credits?.crew?.find(member => member.job === 'Director')?.name || "Unknown",
        genres: details.genres ? details.genres.map(g => g.name) : [],
        runtime: details.runtime || details.episode_run_time?.[0],
        rating: details.vote_average,
        plot: details.overview,
        cast: details.credits?.cast ? details.credits.cast.slice(0, 10).map(actor => actor.name) : [],
      };
  
      setSelectedItem(formattedDetails); // Store detailed movie info
    } catch (error) {
      console.error("Error fetching item details:", error);
      setError("Could not load details. Please try again.");
    }
  };

  return (
    <div className="app min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Movie & TV Recommendations</h1>
        <p className="mt-2">Find your next favorite watch</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {API_KEY === 'YOUR_TMDB_API_KEY' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">API Key Missing</p>
            <p>Please replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key in App.js</p>
          </div>
        )}

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Preferences Form */}
        <PreferencesForm onSubmitPreferences={handleSubmitPreferences} />

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        <section className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {recommendations.length > 0 ? 'Results' : 'Start by searching or selecting your preferences'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {recommendations.map((item) => (
                  <MovieCard key={item.id} item={item} onSelect={handleSelectItem} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Movie Details Modal */}
        {selectedItem && (
          <MovieDetails movie={selectedItem} onClose={handleCloseDetails} />
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>Data provided by TMDB</p>
      </footer>
    </div>
  );
}

export default App;
