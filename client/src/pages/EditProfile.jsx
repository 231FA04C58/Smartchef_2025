import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, updateUserProfile } from '../services/userService';

const EditProfile = () => {
  const { currentUser, user, updateUser } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      if (response.success) {
        const userData = response.data.user;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || ''
        });
      }
    } catch (err) {
      console.error('Load profile error:', err);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      showError('Please enter at least your first name or last name');
      return;
    }

    try {
      setSaving(true);
      const response = await updateUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim()
      });

      if (response.success) {
        success('Profile updated successfully!');
        // Update auth context with new user data
        if (updateUser) {
          updateUser(response.data.user);
        }
        navigate('/profile');
      } else {
        showError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayUser = currentUser || user;

  return (
    <div className="container edit-profile-page">
      <div className="edit-profile-header">
        <button onClick={handleCancel} className="btn btn-outline" style={{ marginBottom: '1rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Profile
        </button>
        <h1>Edit Profile</h1>
        <p className="muted">Update your personal information</p>
      </div>

      <div className="edit-profile-form-container">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="firstName">
                <i className="fas fa-user"></i> First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                <i className="fas fa-user"></i> Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-at"></i> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                disabled
                className="disabled-input"
                title="Username cannot be changed"
              />
              <small className="form-hint">Username cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled-input"
                title="Email cannot be changed here"
              />
              <small className="form-hint">Email cannot be changed here</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

