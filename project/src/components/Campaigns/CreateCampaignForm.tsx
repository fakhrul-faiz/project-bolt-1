import React, { useState } from 'react';
import { Upload, X, Plus, DollarSign, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Campaign, calculateCampaignPrice } from '../../types';

interface CreateCampaignFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { campaigns, setCampaigns } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productName: '',
    category: '',
    duration: '30sec' as '30sec' | '1min' | '3min',
    rateLevel: 1 as 1 | 2 | 3,
    mediaType: 'both' as 'image' | 'video' | 'both',
  });
  const [productImages, setProductImages] = useState<string[]>([]);

  const categories = [
    'Technology',
    'Fashion & Beauty',
    'Food & Beverage',
    'Health & Fitness',
    'Travel & Lifestyle',
    'Gaming',
    'Education',
    'Home & Garden',
    'Sports',
    'Entertainment',
    'Business & Finance',
    'Automotive',
    'Other'
  ];

  const durationOptions = [
    { value: '30sec', label: '30 Seconds' },
    { value: '1min', label: '1 Minute' },
    { value: '3min', label: '3 Minutes' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  // Calculate price based on current selections
  const currentPrice = calculateCampaignPrice(formData.rateLevel, formData.duration);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rateLevel' ? Number(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - in real app, would upload to cloud storage
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400`
      );
      setProductImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      founderId: user.id,
      title: formData.title,
      description: formData.description,
      productName: formData.productName,
      category: formData.category,
      duration: formData.duration,
      productImages: productImages.length > 0 ? productImages : ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rateLevel: formData.rateLevel,
      mediaType: formData.mediaType,
      budget: 0,
      price: currentPrice,
      status: 'active',
      applicants: [],
      approvedTalents: [],
      createdAt: new Date(),
    };

    // Add to campaigns list
    setCampaigns([...campaigns, newCampaign]);
    
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter campaign title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your campaign and what you're looking for"
            />
          </div>

          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              required
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Content Duration *
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rateLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Rate Level *
              </label>
              <select
                id="rateLevel"
                name="rateLevel"
                value={formData.rateLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 Star - Entry Level</option>
                <option value={2}>2 Star - Intermediate</option>
                <option value={3}>3 Star - Premium</option>
              </select>
            </div>

            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                Media Type *
              </label>
              <select
                id="mediaType"
                name="mediaType"
                value={formData.mediaType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="image">Image Only</option>
                <option value="video">Video Only</option>
                <option value="both">Both Image & Video</option>
              </select>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Campaign Price</h4>
                </div>
                <p className="text-3xl font-bold text-green-800">{formatCurrency(currentPrice)}</p>
                <p className="text-sm text-green-700">
                  {formData.rateLevel} Star Level • {durationOptions.find(d => d.value === formData.duration)?.label}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Pricing Information:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• This amount will be paid to the talent upon review approval</li>
                    <li>• Price is automatically calculated based on rate level and duration</li>
                    <li>• Payment will be deducted from your wallet balance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> product images
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : `Create Campaign - ${formatCurrency(currentPrice)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignForm;