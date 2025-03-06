import React, { useState } from 'react';
import './PreferencesForm.css';

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
        <div className="preferences-form">
            <h2>Find Your Perfect Watch</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>What are you in the mood for?</label>
                    <div className="media-type-container">
                        <label className="media-type-option">
                            <input
                                type="radio"
                                name="mediaType"
                                value="movie"
                                checked={preferences.mediaType === 'movie'}
                                onChange={handleChange}
                            />
                            Movie
                        </label>
                        <label className="media-type-option">
                            <input
                                type="radio"
                                name="mediaType"
                                value="tv"
                                checked={preferences.mediaType === 'tv'}
                                onChange={handleChange}
                            />
                            TV Show
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Select Genres</label>
                    <div className="genre-grid">
                        {genreOptions.map((genre) => (
                            <label key={genre.id} className="genre-item">
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={preferences.genres.includes(genre.id)}
                                    onChange={handleGenreChange}
                                />
                                {genre.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Release Year Range</label>
                    <div className="year-range">
                        <div>
                            <label>From</label>
                            <input
                                type="number"
                                name="yearFrom"
                                min="1900"
                                max="2025"
                                value={preferences.yearFrom}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>To</label>
                            <input
                                type="number"
                                name="yearTo"
                                min="1900"
                                max="2025"
                                value={preferences.yearTo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group slider-container">
                    <input
                        type="range"
                        name="minRating"
                        min="0"
                        max="10"
                        step="0.5"
                        value={preferences.minRating}
                        onChange={handleChange}
                    />
                    <div className="rating-label">
                        <span>Minimum Rating</span>
                        <span className="rating-value">{preferences.minRating}/10</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="genre-item">
                        <input
                            type="checkbox"
                            name="includeAdult"
                            checked={preferences.includeAdult}
                            onChange={handleChange}
                        />
                        Include adult content
                    </label>
                </div>

                <button
                    type="submit"
                    className="submit-button">
                    Find Recommendations
                </button>
            </form>
        </div>
    );
};

export default PreferencesForm;