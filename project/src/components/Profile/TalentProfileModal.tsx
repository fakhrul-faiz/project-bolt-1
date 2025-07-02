import React, { useState } from 'react';
import { X, User, Mail, Star, Save, Camera, Instagram, Youtube, Plus, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Talent } from '../../types';

interface TalentProfileModalProps {
  onClose: () => void;
}

const TalentProfileModal: React.FC<TalentProfileModalProps> = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const { earnings } = useApp();
  const talent = user as Talent;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: talent.name || '',
    email: talent.email || '',
    bio: talent.bio || '',
    skills: talent.skills || [],
    socialMedia: {
      instagram: talent.socialMedia?.instagram || '',
      youtube: talent.socialMedia?.youtube || '',
    },
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      const updatedTalent: Talent = {
        ...talent,
        ...formData,
      };
      
      // In a real app, this would call an API
      updateProfile?.(updatedTalent);
      
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  // Calculate talent statistics
  const totalEarnings = earnings.filter(e => e.talentId === talent.id && e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const completedJobs = earnings.filter(e => e.talentId === talent.id && e.status === 'paid').length;
  const pendingEarnings = earnings.filter(e => e.talentId === talent.id && e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const getRateLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-blue-100 text-blue-800';
      case 3:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {talent.name.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Change Avatar"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
              <p className="text-gray-600">{talent.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  Talent
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRateLevelColor(talent.rateLevel)}`}>
                  {talent.rateLevel} Star Level
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself, your experience, and what makes you unique as a content creator..."
            />
          </div>

          {/* Skills Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill (e.g., Photography, Video Editing)"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Instagram className="h-5 w-5 text-pink-500" />
                  </div>
                  <input
                    type="text"
                    id="socialMedia.instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="socialMedia.youtube" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-red-500" />
                  </div>
                  <input
                    type="text"
                    id="socialMedia.youtube"
                    name="socialMedia.youtube"
                    value={formData.socialMedia.youtube}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Channel name or URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload your best work samples</p>
              <p className="text-sm text-gray-500">PNG, JPG, MP4 up to 10MB each</p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
            </div>
            
            {talent.portfolio && talent.portfolio.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {talent.portfolio.map((item, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={item}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Statistics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Earnings</p>
                    <p className="text-xl font-bold text-green-900">
                      {formatCurrency(totalEarnings)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Completed Jobs</p>
                    <p className="text-xl font-bold text-blue-900">{completedJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending Earnings</p>
                    <p className="text-xl font-bold text-yellow-900">
                      {formatCurrency(pendingEarnings)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TalentProfileModal;