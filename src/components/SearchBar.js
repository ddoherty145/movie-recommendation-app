import React from "react";

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    }

    return (
        <div className="search-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      );
    };
    
    export default SearchBar;