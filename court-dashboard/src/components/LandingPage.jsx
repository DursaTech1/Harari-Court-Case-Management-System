import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { fetchCourtServices } from '../api/api';

const LandingPage = ({ onOpenLogin, onOpenRegister, courtServices }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeService, setActiveService] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchCourtServices();
        setCourtServices(data);
      } catch (err) {
        console.error('Failed to load services', err);
      }
    };
    loadServices();
  }, []);

  // Categories based on your services
  const categories = ['all', 'filing', 'status', 'documents', 'payments', 'hearing', 'legal', 'appeal'];

  // Filter services
  const filteredServices = courtServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'filing' && service.name.includes('Filing')) ||
                           (selectedCategory === 'status' && service.name.includes('Status')) ||
                           (selectedCategory === 'documents' && service.name.includes('Document')) ||
                           (selectedCategory === 'payments' && service.name.includes('Payment')) ||
                           (selectedCategory === 'hearing' && service.name.includes('Hearing')) ||
                           (selectedCategory === 'legal' && service.name.includes('Legal')) ||
                           (selectedCategory === 'appeal' && service.name.includes('Appeal'));
    return matchesSearch && matchesCategory;
  });

  // Format time and date
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle service click
  const handleServiceClick = (service) => {
    setActiveService(service);
  };

  // Close modal
  const closeServiceModal = () => {
    setActiveService(null);
  };



  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">⚖️</div>
            <div className="logo-text">
              <h1>Harari Court</h1>
              <p>Digital Services Portal</p>
            </div>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-right ${showMobileMenu ? 'show' : ''}`}>          
            <div className="nav-clock">
              <div className="clock-icon">🕐</div>
              <div className="clock-content">
                <div className="clock-time">{formatTime(currentTime)}</div>
                <div className="clock-date">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image-container">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-tag">Trusted & Secure</div>
            <h1 className="hero-title">
              የሀረሪ ክልል ጠቅላይ ፍርድ ቤት
              <span className="hero-title-highlight">HARARI REGION SUPREME COURT </span>
            </h1>
            <p className="hero-description">
              "ቀልጣፋና ዉጤታማ ለሆነ የዳኝነት አገልግሎት እንተጋለን!" <br />
             " We strive for efficient and effective judicial services”
            </p>
            
            <div className="hero-actions">
              <button className="hero-action-btn primary-btn" onClick={onOpenRegister}>
                Get Started
                
              </button>
              <button className="hero-action-btn secondary-btn" onClick={onOpenLogin}>
                Explore Services
              </button>
            </div>
            
            
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <h1 className="services-title">ፈጣን አገልግሎቶች</h1>
            <p className="services-subtitle">
              Access our comprehensive suite of digital court services
            </p>
          </div>
          {/* Court Services */}
          <div className="quick-access">
            
            <div className="quick-access-grid">
              {courtServices.slice(0, 7).map(service => (
                <button 
                  key={service.id}
                  className="quick-access-card"
                  onClick={onOpenLogin}
                >
                  <span className="quick-access-icon">{service.icon}</span>
                  <span className="quick-access-text">{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="process-container">
          <div className="process-header">
            <h2>How Digital Court Works</h2>
            <p>Simple steps to access court services online</p>
          </div>
          
          <div className="proces-steps">
            
            <div className="proces-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Register Account</h3>
                <p>Create your secure court portal account</p>
              </div>
            </div>
            <div className="proces-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Select Service</h3>
                <p>Choose from our range of court services</p>
              </div>
            </div>
            
            <div className="proces-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Complete Process</h3>
                <p>Submit required information and documents</p>
              </div>
            </div>
            
            <div className="proces-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Track Progress</h3>
                <p>Monitor your case in the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Access Court Services?</h2>
            <p>
              Join thousands who have streamlined their court proceedings with our digital platform.
            </p>
            <div className="cta-actions">
              <button className="cta-btn primary-cta" onClick={onOpenRegister}>
                Create Your Account
              </button>
              <button className="cta-btn secondary-cta" onClick={onOpenLogin}>
                Sign In to Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-logo-section">
              <div className="footer-logo">
                <div className="logo-icon">⚖️</div>
                <div className="logo-text">
                  <h3>Harari Court</h3>
                  <p>Digital Services Portal</p>
                </div>
              </div>
              <p className="footer-mission">
                Providing accessible and efficient court services through digital innovation.
              </p>
            </div>
            
            <div className="footer-services">
              <h4>Core Services</h4>
              <div className="service-links">
                {courtServices.slice(0, 4).map(service => (
                  <a key={service.id} href="#">{service.name}</a>
                ))}
              </div>
            </div>
            
            <div className="footer-contact">
              <h4>Contact Court</h4>
              <div className="contact-info">
                <p><span className="contact-icon">📍</span> Harari High Court, Harar, Ethiopia</p>
                <p><span className="contact-icon">📞</span> +251-XXX-XXX-XXX</p>
                <p><span className="contact-icon">✉️</span> digitalcourt@harari.gov.et</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} Harari Court Judicial System. All rights reserved.
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Service Details Modal */}
      {activeService && (
        <div className="service-modal-overlay" onClick={closeServiceModal}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeServiceModal}>✕</button>
            
            <div className="modal-header">
              <div className="modal-icon">{activeService.icon}</div>
              <div className="modal-title-section">
                <h2>{activeService.name}</h2>
                <p className="modal-description">{activeService.description}</p>
              </div>
            </div>
            
            <div className="modal-body">
              {activeService.requirements && (
                <div className="requirements-section">
                  <h4>Requirements:</h4>
                  <ul>
                    {activeService.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-action-btn primary-action" onClick={() => {
                closeServiceModal();
                onOpenRegister();
              }}>
                Access Service
              </button>
              <button className="modal-action-btn secondary-action" onClick={closeServiceModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;