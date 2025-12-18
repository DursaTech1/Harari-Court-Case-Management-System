import React, { useState } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ userProfile, onClose, onUpdate, onFileUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(userProfile);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG)');
      return;
    }

    setUploading(true);
    try {
      const fileUrl = await onFileUpload(file, 'profile_picture');
      if (fileUrl) {
        setProfileData(prev => ({
          ...prev,
          profilePicture: fileUrl
        }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onUpdate(profileData);
    setIsEditing(false);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  {profileData.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="upload-label">
                {uploading ? 'Uploading...' : 'Change Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{profileData.fullName}</p>
              )}
            </div>

            <div className="form-group">
              <label>User ID</label>
              <p className="form-value">{profileData.userId}</p>
            </div>

            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{profileData.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{profileData.phone}</p>
              )}
            </div>

            <div className="form-group">
              <label>Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                />
              ) : (
                <p className="form-value">{profileData.address}</p>
              )}
            </div>
          </div>

          <div className="modal-actions">
            {isEditing ? (
              <>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button className="btn-secondary" onClick={onClose}>
                  Close
                </button>
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;