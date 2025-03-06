import React from 'react';

const MovieDetails = ({ movie, onClose }) => {
  // If no movie is selected, don't render anything
  if (!movie) return null;

  // Extract all relevant info
  const title = movie.title || movie.name || '';
  const releaseDate = movie.releaseDate || movie.release_date || movie.first_air_date || '';
  const formattedDate = releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  
  // Poster path - check all possible properties
  const posterPath = movie.poster_path || (movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null);
  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '/api/placeholder/300/450';
    
  // Backdrop path for background
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  // Get overview/plot from either property
  const overview = movie.overview || movie.plot || '';

  // Get genres, handling both objects and strings
  const genres = movie.genres || [];

  return (
    <div className="movie-detail">
      {/* Backdrop Image */}
      {backdropUrl && (
        <div className="movie-backdrop" style={{
          backgroundImage: `linear-gradient(rgba(20, 20, 20, 0.7), rgba(20, 20, 20, 0.9)), url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '12px',
          zIndex: 0
        }}></div>
      )}
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 2
        }}
      >
        ×
      </button>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '25px' }}>
        {/* Movie Poster */}
        <div style={{ flexShrink: 0, width: '230px' }}>
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={`${title} poster`} 
              style={{
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              aspectRatio: '2/3',
              background: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}>
              No Poster Available
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="movie-rating" style={{
            margin: '15px auto',
            display: 'table',
            backgroundColor: rating === 'NR' ? '#666' : 
                          parseFloat(rating) >= 8 ? '#2c7a2c' : 
                          parseFloat(rating) >= 6 ? '#b7950b' : '#a51d1d'
          }}>
            {rating}/10
          </div>
        </div>
        
        {/* Movie Details */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontSize: '32px', 
            marginTop: 0, 
            marginBottom: '10px',
            color: 'var(--text-color)'
          }}>
            {title}
          </h2>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '15px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <span>{formattedDate}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>
          
          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className="movie-genres" style={{ marginBottom: '20px' }}>
              {genres.map((genre, index) => (
                <span key={index} className="movie-genre">
                  {typeof genre === 'object' ? genre.name : genre}
                </span>
              ))}
            </div>
          )}
          
          {/* Director - if available */}
          {movie.director && movie.director !== "Unknown" && (
            <div style={{ marginBottom: '15px', color: 'rgba(255, 255, 255, 0.85)' }}>
              <strong>Director:</strong> {movie.director}
            </div>
          )}
          
          {/* Overview/Plot */}
          {overview && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                marginBottom: '10px',
                color: 'var(--primary-color)'
              }}>
                Overview
              </h3>
              <p style={{ 
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {overview}
              </p>
            </div>
          )}
          
          {/* Cast - if available */}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                marginBottom: '10px',
                color: 'var(--primary-color)'
              }}>
                Cast
              </h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px'
              }}>
                {movie.cast.map((actor, index) => (
                  <span key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;