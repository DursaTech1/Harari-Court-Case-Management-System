import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  
  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];

  const buttonLabels = [
    'Button 1',
    'Button 2', 
    'Button 3',
    'Button 4',
    'Button 5',
    'Button 6',
    'Button 7'
  ];

  // Single image URL
  const singleImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop';

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Format time to HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleButtonClick = (buttonIndex) => {
    setOpenDropdown(openDropdown === buttonIndex ? null : buttonIndex);
  };

  const handleLanguageSelect = (buttonIndex, language) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [buttonIndex]: language
    }));
    setOpenDropdown(null);
  };

  const handleCloseDropdown = (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.language-button')) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className="app" onClick={handleCloseDropdown}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="date-time">{currentTime.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span className="time">{formatTime(currentTime)}</span>
        </div>

        <div className="header-center">
          <h1>Count Entrance - PSCR</h1>
        </div>

        <div className="header-right">
          <span className="status">System Operational</span>
          <span className="weather">Harar_24°C, clear sky</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Single Static Image */}
        <section className="image-section">
          <div className="single-image-container">
            <img 
              src={singleImage}
              alt="Dashboard Content"
              className="static-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400/1a1f2e/ffffff?text=Placeholder+Image';
              }}
            />
          </div>
        </section>

        {/* 7 Buttons with Language Dropdowns */}
        <section className="buttons-section">
          <h2>Language Selectors</h2>
          <p className="subtitle">Click any button to select a language</p>
          
          <div className="buttons-container">
            {buttonLabels.map((label, index) => (
              <div key={index} className="button-wrapper">
                <button
                  className={`language-button ${openDropdown === index ? 'active' : ''}`}
                  onClick={() => handleButtonClick(index)}
                >
                  {label}
                  {selectedLanguages[index] && (
                    <span className="selected-language">
                      {selectedLanguages[index].flag} {selectedLanguages[index].name}
                    </span>
                  )}
                </button>
                
                {openDropdown === index && (
                  <div className="dropdown">
                    <div className="dropdown-header">
                      <h4>Select Language for {label}</h4>
                      <button 
                        className="close-btn"
                        onClick={() => setOpenDropdown(null)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="language-list">
                      {languages.map((language) => (
                        <div
                          key={language.code}
                          className="language-option"
                          onClick={() => handleLanguageSelect(index, language)}
                        >
                          <span className="flag">{language.flag}</span>
                          <span className="name">{language.name}</span>
                          <span className="code">({language.code})</span>
                          {selectedLanguages[index]?.code === language.code && (
                            <span className="selected-icon">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;