import React, { useState } from 'react';
import { X, Upload, Camera, Video, FileText, AlertCircle } from 'lucide-react';
import { Order } from '../../types';

interface SubmitReviewModalProps {
  job: Order;
  onClose: () => void;
  onSuccess: (jobId: string, reviewData: any) => void;
}

const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ job, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      const maxSize = mediaType === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
      if (file.size > maxSize) {
        alert(`File size too large. Maximum size is ${mediaType === 'image' ? '10MB' : '50MB'}.`);
        return;
      }

      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return;

    setLoading(true);

    // Simulate file upload and processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock uploaded file URL
    const mockUploadedUrl = mediaType === 'image' 
      ? 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
      : 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';

    onSuccess(job.id, {
      mediaUrl: mockUploadedUrl,
      mediaType: mediaType,
      notes: reviewNotes
    });

    setLoading(false);
  };

  const removeFile = () => {
    setMediaFile(null);
    setMediaPreview('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Submit Review Content</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">{job.campaignTitle}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Product: <span className="font-medium">{job.productName}</span></p>
                <p className="text-blue-700">Payout: <span className="font-medium text-green-600">${job.payout}</span></p>
              </div>
              <div>
                <p className="text-blue-700">Order ID: <span className="font-medium">#{job.id}</span></p>
                <p className="text-blue-700">Status: <span className="font-medium">Product Delivered</span></p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Review Guidelines</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Create authentic, engaging content showcasing the product</li>
                  <li>• Ensure good lighting and clear audio (for videos)</li>
                  <li>• Include key product features and benefits</li>
                  <li>• Be honest and genuine in your review</li>
                  <li>• Follow platform guidelines for content creation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMediaType('image');
                  removeFile();
                }}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  mediaType === 'image' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Camera className="h-8 w-8" />
                <div className="text-center">
                  <span className="text-sm font-medium">Photo Review</span>
                  <p className="text-xs text-gray-500 mt-1">High-quality product photos</p>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setMediaType('video');
                  removeFile();
                }}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  mediaType === 'video' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Video className="h-8 w-8" />
                <div className="text-center">
                  <span className="text-sm font-medium">Video Review</span>
                  <p className="text-xs text-gray-500 mt-1">Engaging video content</p>
                </div>
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload {mediaType === 'image' ? 'Photo' : 'Video'} *
            </label>
            
            {!mediaFile ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> your {mediaType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mediaType === 'image' 
                        ? 'PNG, JPG or JPEG (MAX. 10MB)' 
                        : 'MP4, MOV or AVI (MAX. 50MB)'
                      }
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Selected File:</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{mediaFile.name}</p>
                
                {/* File Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {mediaType === 'image' ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full h-48"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Review Notes */}
          <div>
            <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="reviewNotes"
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about your review content or creative approach..."
              />
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
              disabled={loading || !mediaFile}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewModal;