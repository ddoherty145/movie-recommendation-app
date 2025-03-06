import React from 'react';

const MovieCard = ({ item, onSelect }) => {
  // Determine if we're handling a movie or TV show
  const isMovie = item.title !== undefined;
  
  // Extract the relevant info based on media type
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  
  // Format the date to a more readable format if it exists
  const formattedDate = releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown';
  
  // TMDB uses a 0-10 scale for ratings
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
  
  // Construct the image URL - TMDB poster path needs to be prefixed
  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : '/api/placeholder/300/450'; // Placeholder for missing images
  
  return (
    <div 
      className="movie-card"
      onClick={() => onSelect(item)}
    >
      {/* Poster Image */}
      <div className="relative">
        {item.poster_path ? (
          <img 
            src={imageUrl} 
            alt={`${title} poster`}
            className="movie-poster"
          />
        ) : (
          <div className="movie-poster-placeholder">
            No Image
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="movie-rating" style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: rating === 'NR' ? '#666' : 
                          parseFloat(rating) >= 8 ? '#2c7a2c' : 
                          parseFloat(rating) >= 6 ? '#b7950b' : '#a51d1d'
        }}>
          {rating}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="movie-info">
        {/* Title */}
        <h3 className="movie-title">
          {title}
        </h3>
        
        {/* Year */}
        <p className="movie-year">
          {formattedDate}
        </p>
        
        {/* Genre Tags - matching the style in CSS */}
        {item.genre_ids && item.genre_ids.length > 0 && (
          <div className="movie-genres">
            {item.genre_ids.slice(0, 3).map((genreId, index) => (
              <span key={genreId} className="movie-genre">
                {genreId}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;