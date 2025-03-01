import React, { useState } from 'react';

const PreferencesForm = ({onSubmitPerences}) => { // State management
    const [preferences, setPreferences] = useState({
        mediaType: 'movie',
        genres: [],
        yearFrom: 2000,
        yearTo: 2025,
        minrating: 7,
        includeAdult: false,
    });

    const genreOptions = [ // Genre options
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
        
        if (type === 'checkbox') {
          setPreferences({ ...preferences, [name]: checked });
        } else {
          setPreferences({ ...preferences, [name]: value });
        }
      };

    const handleGenreChange = (e) => { // Handle genre change
        const genreId = parseInt(e.target.value, 10);

        // If the genre is already selected, remove it; otherwise, add it
        if (preferences.genres.includes(genreId)) {
            setPreferences({
                ...preferences,
                genres: preferences.genres.filter((id) => id !== genreId)
            });
        } else {
            setPreferences({
                ...preferences,
                genres: [...preferences.genres, genreId]
            });
        }
    };

    const handleSubmit = (e) => { // Handle submit
        e.preventDefault();
        onSubmitPerences(preferences);
    };

    return (
        <div className="preferences-form p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Find the Next Perfect Movie/TV Show to Watch</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    {/* Media type */}
                    <label className="block mb-2 font-medium">What are you in the modd for?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="ratio"
                                name="mediaType"
                                value="movie"
                                check={preferences.mediaType === 'movie'}
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
                                check={preferences.mediaType === 'tv'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            TV Show
                        </label>

                    </div>
                </div>

                {/* Genres */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium"> Select Genres (multiple allowed)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {genreOptions.map(genre => (
                            <label key={genre.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={preferences.genres.incliudes(genre.id)}
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
                        Minimum Rating: {preferences.minrating}/10
                    </label>
                    <input
                        type="range"
                        name="minRating"
                        min="0"
                        max="10"
                        step="0.5"
                        value={preferences.minRating}
                        onChange="w-full"
                    />
                  </div>

                  {/* Adult Content */}
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbx"
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
}

export default PreferencesForm;