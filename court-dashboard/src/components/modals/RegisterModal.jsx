import React, { useState } from 'react';
import './RegisterModal.css';

const RegisterModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const user = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      userId: 'HCU-' + Math.floor(100000 + Math.random() * 900000),
      registrationDate: new Date().toLocaleDateString()
    };
    
    onSubmit(user);
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal">
        <div className="register-modal-header">
          <h2>Register for Court Services</h2>
          <button className="register-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="register-modal-body">
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required 
                placeholder="Enter your full name as per ID" 
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="Enter your email address" 
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required 
                placeholder="Enter your phone number" 
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
                placeholder="Create a strong password" 
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
                placeholder="Confirm your password" 
                minLength="6"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Create Account
              </button>
            </div>
            <p className="terms-agreement">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;