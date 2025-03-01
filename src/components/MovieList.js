import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, onSelectMovie, isLoading, error }) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading movies...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Handle empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4 rounded">
        <p>No movies found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="movie-list-container my-6">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            item={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;