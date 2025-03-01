import React, { useState } from 'react';

const PreferencesForm = ({ onSubmitPreferences }) => {
    const [preferences, setPreferences] = useState({
        mediaType: 'movie',
        genres: [],
        yearFrom: 2000,
        yearTo: 2025,
        minRating: 7,
        includeAdult: false,
    });

    const genreOptions = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setPreferences((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGenreChange = (e) => {
        const genreId = parseInt(e.target.value, 10);
        setPreferences((prev) => ({
            ...prev,
            genres: prev.genres.includes(genreId)
                ? prev.genres.filter((id) => id !== genreId)
                : [...prev.genres, genreId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitPreferences(preferences);
    };

    return (
        <div className="preferences-form p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Find the Next Perfect Movie/TV Show to Watch</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    {/* Media type */}
                    <label className="block mb-2 font-medium">What are you in the mood for?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="mediaType"
                                value="movie"
                                checked={preferences.mediaType === 'movie'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Movie
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="mediaType"
                                value="tv"
                                checked={preferences.mediaType === 'tv'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            TV Show
                        </label>
                    </div>
                </div>

                {/* Genres */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Select Genres (multiple allowed)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {genreOptions.map((genre) => (
                            <label key={genre.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={preferences.genres.includes(genre.id)}
                                    onChange={handleGenreChange}
                                    className="mr-2"
                                />
                                {genre.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Year range */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Release Year Range</label>
                    <div className="flex gap-4">
                        <div>
                            <label className="block mb-1 text-sm">From</label>
                            <input
                                type="number"
                                name="yearFrom"
                                min="1900"
                                max="2025"
                                value={preferences.yearFrom}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">To</label>
                            <input
                                type="number"
                                name="yearTo"
                                min="1900"
                                max="2025"
                                value={preferences.yearTo}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Minimum rating Slider */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Minimum Rating: {preferences.minRating}/10
                    </label>
                    <input
                        type="range"
                        name="minRating"
                        min="0"
                        max="10"
                        step="0.5"
                        value={preferences.minRating}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                {/* Adult Content */}
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="includeAdult"
                            checked={preferences.includeAdult}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Include adult content
                    </label>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                    Find Recommendations
                </button>
            </form>
        </div>
    );
};

export default PreferencesForm;
