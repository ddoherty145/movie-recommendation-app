const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = '930b6a588a6cdeac69bdbb7d86c42138';

/**
 * Construct the request URL with the API key and any additional parameters
 * @param {string} endpoint - THE API endpoint
 * @param {Object} params - Additional parameters
 * @returns {string} Fully constructed URL
 */

const buildUrl = (endpoint, params = {}) => {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    // Add API key to the URL
    url.searchParams.append('api_key', API_KEY);

    // Add any additional parameters
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !=='') {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
};

/**
 * Make a GET request to the TMDB API
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - Additional parameters
 * @returns {Promise} Promise resolving to the JSON response
 */

const fetchFromApi = async (endpoint, params) => {
    try {
        const url = buildUrl(endpoint, params);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }
        return await response.json();
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

/**
 * Get movie recommendations based on user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise} Promise resolving to the JSON response
 */

const getRecommendations = async (preferences) => {
    const { mediaType, genres, yearFrom, yearTo, minRating, includeAdult } = preferences;

    // Construct the API endpoint
    const yearParam = mediaType === 'movie' ? {
        'primary_release_date.gte': `${yearFrom}-01-01`,
        'primary_release_date.lte': `${yearTo}-12-31`,
    } : {
        'first_air_date.gte': `${yearFrom}-01-01`,
        'first_air_date.lte': `${yearTo}-12-31`,
    };

    // Discover endpoint used to find content based on filters
    return fetchFromApi(`/discover/${mediaType}`, {
        with_genres: genres.join(','),
        'vote_average.gte': minRating,
        include_adult: includeAdult,
        ...yearParam,
        page: 1
    });
};

/**
 * Search for movies or TV shows by name
 * @param {string} query - Search query
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise} Promise resolving to the JSON response
 */
const searchMedia = async (query, type = 'movie') => {
    return fetchFromApi(`/search/${type}`, {
        query,
        include_adult: false,
    });
}

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
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise} Promise resolving to the JSON response
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

  // Export all the functions
export default {
    getRecommendations,
    searchMedia,
    getDetails,
    getGenres,
    getTrending
  };