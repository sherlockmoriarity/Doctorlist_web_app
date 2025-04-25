// components/Header.js
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

function Header({ onSearch, doctors, searchTerm }) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Add click outside listener to close suggestions
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsInputFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    // Filter doctors by name and take top 3 matches
    const filteredSuggestions = doctors
      .filter(doctor => doctor.name && doctor.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 3);
    
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (doctor) => {
    setInputValue(doctor.name);
    onSearch(doctor.name);
    setSuggestions([]);
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    // Re-trigger suggestions when focusing
    if (inputValue.trim() !== '') {
      const filteredSuggestions = doctors
        .filter(doctor => doctor.name && doctor.name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 3);
      
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setSuggestions([]);
    setIsInputFocused(false);
  };

  // Helper function to get specialty display text
  const getSpecialtyText = (doctor) => {
    if (doctor.specialities && doctor.specialities.length > 0) {
      return doctor.specialities.map(s => s.name).join(', ');
    }
    return '';
  };

  return (
    <header className="header">
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Symptoms, Doctors, Specialists, Clinics"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            data-testid="autocomplete-input"
            ref={inputRef}
          />
          <button type="submit" className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </form>
        
        {isInputFocused && suggestions.length > 0 && (
          <div className="suggestions-dropdown" ref={suggestionsRef}>
            {suggestions.map((doctor, index) => (
              <div 
                key={index} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(doctor)}
                data-testid="suggestion-item"
              >
                <div className="suggestion-content">
                  <div className="doctor-img">
                    <img 
                      src={doctor.photo || "/api/placeholder/48/48"} 
                      alt={doctor.name}
                      onError={(e) => {e.target.src = "/api/placeholder/48/48"}} 
                    />
                  </div>
                  <div className="suggestion-text">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className="doctor-specialty">{getSpecialtyText(doctor)}</div>
                  </div>
                  <div className="suggestion-arrow">›</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;