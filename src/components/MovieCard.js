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
  
  // Generate a color for the rating badge based on score
  const getRatingColor = (score) => {
    if (score === 'NR') return 'bg-gray-500';
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'bg-green-600';
    if (numScore >= 6) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div 
      className="movie-card bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-xl hover:scale-105 cursor-pointer"
      onClick={() => onSelect(item)}
    >
      {/* Poster Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${title} poster`}
          className="w-full h-full object-cover"
        />
        {/* Rating Badge */}
        <div className={`absolute top-2 right-2 ${getRatingColor(rating)} text-white text-sm font-bold py-1 px-2 rounded-full`}>
          {rating}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-lg mb-1 truncate" title={title}>
          {title}
        </h3>
        
        {/* Year */}
        <p className="text-gray-600 text-sm mb-2">
          {formattedDate}
        </p>
        
        {/* Genre Tags - assuming genre_ids are matched elsewhere */}
        <div className="flex flex-wrap gap-1">
          {item.genre_ids && item.genre_ids.slice(0, 3).map(genreId => (
            <span key={genreId} className="bg-gray-200 text-xs px-2 py-1 rounded">
              {genreId}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;