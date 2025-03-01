import React, { useState, useEffect } from 'react';
import PreferencesForm from './components/PreferencesForm';
import MovieCard from './components/MovieCard';
import apiService from './services/api';
import SearchBar from './components/SearchBar';

// Replace with your actual API key
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Set the API key in the api module
apiService.API_KEY = API_KEY;

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
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
      setLoading(true);
      setError(null);

      const searchResults = await apiService.searchMedia(query, 'movie');

      if (!searchResults.results || searchResults.results.length === 0) {
        setError('No results found. Try a different search.');
        setRecommendations([]);
      } else {
        setRecommendations(searchResults.results);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error during search:', err);
      setError(`Error: ${err.message}`);
      setRecommendations([]);
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
    try {
      setLoading(true);
      const mediaType = item.title ? 'movie' : 'tv';

      const details = await apiService.getDetails(item.id, mediaType);
      setSelectedItem(details);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError(`Failed to load details: ${err.message}`);
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
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

        {/* Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{selectedItem.title || selectedItem.name}</h2>
                  <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-800">
                    Close
                  </button>
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={
                        selectedItem.poster_path
                          ? `https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`
                          : '/api/placeholder/300/450'
                      }
                      alt={selectedItem.title || selectedItem.name}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>

                  <div className="md:w-2/3">
                    <p className="text-gray-700 mb-4">{selectedItem.overview}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">Release Date</h3>
                        <p>{selectedItem.release_date || selectedItem.first_air_date || 'Unknown'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Rating</h3>
                        <p>{selectedItem.vote_average ? `${selectedItem.vote_average.toFixed(1)}/10` : 'Not rated'}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.genres &&
                          selectedItem.genres.map((genre) => (
                            <span key={genre.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {genre.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>Data provided by TMDB</p>
      </footer>
    </div>
  );
}

export default App;
