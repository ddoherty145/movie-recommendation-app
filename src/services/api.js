// Base URL for TMDB API
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Set API Key from environment variables
let API_KEY = process.env.REACT_APP_TMDB_API_KEY || '';

// API key function to set key before making requests
const setApiKey = (key) => {
    if (!key) {
        throw new Error('API key is missing')
    }
    API_KEY = key;
}

/**
 * Constructs the request URL with the API key and any additional parameters
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Additional query parameters
 * @returns {string} Full URL for the API request
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (!API_KEY) {
    throw new Error('TMDB API key is missing. Set REACT_APP_TMDB_API_KEY in your environment variables.');
  }

  url.searchParams.append('api_key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
};

/**
 * Makes a GET request to the TMDB API
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Additional query parameters
 * @returns {Promise} Promise resolving to the JSON response
 */
const fetchFromApi = async (endpoint, params = {}) => {
  try {
    const url = buildUrl(endpoint, params);
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    if (!responseText.trim()) {
      throw new Error('Empty response received from API');
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

/**
 * Get recommendations based on user preferences
 * @param {Object} preferences - User preferences object
 * @returns {Promise} Promise resolving to recommendations
 */
const getRecommendations = async (preferences) => {
  const { mediaType, genres, yearFrom, yearTo, minRating, includeAdult } = preferences;

  const yearParam = mediaType === 'movie' ? {
    'primary_release_date.gte': `${yearFrom}-01-01`,
    'primary_release_date.lte': `${yearTo}-12-31`
  } : {
    'first_air_date.gte': `${yearFrom}-01-01`,
    'first_air_date.lte': `${yearTo}-12-31`
  };

  const genreParam = genres.length > 0 ? { with_genres: genres.join(',') } : {};

  return fetchFromApi(`/discover/${mediaType}`, {
    ...genreParam,
    'vote_average.gte': minRating,
    include_adult: includeAdult,
    sort_by: 'popularity.desc',
    ...yearParam,
    page: 1
  });
};

/**
 * Search for movies or TV shows by name
 * @param {string} query - Search term
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise} Promise resolving to search results
 */
const searchMedia = async (query, type = 'movie') => {
  return fetchFromApi(`/search/${type}`, {
    query,
    include_adult: false,
  });
};

/**
 * Get detailed information about a specific movie or TV show
 * @param {number} id - Movie or TV show ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise} Promise resolving to detailed item data
 */
const getDetails = async (id, type = 'movie') => {
  return fetchFromApi(`/${type}/${id}`, {
    append_to_response: 'credits,videos,similar'
  });
};

/**
 * Get a list of genres for movies or TV shows
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise} Promise resolving to genres list
 */
const getGenres = async (type = 'movie') => {
  return fetchFromApi(`/genre/${type}/list`);
};

/**
 * Get trending content for today or this week
 * @param {string} type - 'movie', 'tv', or 'all'
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise} Promise resolving to trending items
 */
const getTrending = async (type = 'all', timeWindow = 'week') => {
  return fetchFromApi(`/trending/${type}/${timeWindow}`);
};

// API Service Object
const apiService = {
  getRecommendations,
  searchMedia, // Ensure this is used correctly in App.js
  getDetails,
  getGenres,
  getTrending,
  set API_KEY(key) {
     setApiKey(key);
  }
};

export default apiService;
