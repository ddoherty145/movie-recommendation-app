import React from 'react';

const MovieDetails = ({ movie, onClose }) => {
  // If no movie is selected, don't render anything
  if (!movie) return null;

  const {
    title,
    releaseDate,
    poster,
    director,
    genres,
    runtime,
    rating,
    plot,
    cast
  } = movie;

  return (
    <div className="movie-details">
      <div className="movie-details-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <div className="movie-header">
          <div className="movie-poster">
            {poster ? (
              <img src={poster} alt={`${title} poster`} />
            ) : (
              <div className="no-poster">No Poster Available</div>
            )}
          </div>
          
          <div className="movie-info">
            <h2>{title}</h2>
            <div className="movie-meta">
              {releaseDate && <span className="release-date">{releaseDate}</span>}
              {runtime && <span className="runtime">{runtime} min</span>}
              {rating && <span className="rating">Rating: {rating}/10</span>}
            </div>
            
            {genres && genres.length > 0 && (
              <div className="genres">
                {genres.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            {director && <p className="director">Director: {director}</p>}
          </div>
        </div>
        
        {plot && (
          <div className="movie-plot">
            <h3>Plot</h3>
            <p>{plot}</p>
          </div>
        )}
        
        {cast && cast.length > 0 && (
          <div className="movie-cast">
            <h3>Cast</h3>
            <ul>
              {cast.map((actor, index) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;