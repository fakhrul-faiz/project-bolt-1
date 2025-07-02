import React, { useState } from 'react';
import { Package, Search, Filter, Eye, Clock, Truck, MapPin, CheckCircle, Upload, Star, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import JobDetailsModal from './JobDetailsModal';
import SubmitReviewModal from './SubmitReviewModal';

const MyJobsPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, setOrders, campaigns } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Order | null>(null);
  const [submittingReview, setSubmittingReview] = useState<Order | null>(null);

  // Filter orders for the current talent
  const talentJobs = orders.filter(order => order.talentId === user?.id);

  // Get campaigns where talent is approved but no order exists yet
  const approvedCampaigns = campaigns.filter(campaign => 
    campaign.approvedTalents.includes(user?.id || '') &&
    !talentJobs.some(job => job.campaignId === campaign.id)
  );

  // Apply search and status filters
  const filteredJobs = talentJobs.filter(job => {
    const matchesSearch = job.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_shipment':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'review_submitted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_shipment':
        return <Clock className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <MapPin className="h-4 w-4" />;
      case 'review_submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_shipment':
        return 'Waiting for Shipment';
      case 'shipped':
        return 'Product Shipped';
      case 'delivered':
        return 'Product Delivered';
      case 'review_submitted':
        return 'Review Submitted';
      case 'completed':
        return 'Job Completed';
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending_shipment':
        return 'The founder is preparing to ship the product to you.';
      case 'shipped':
        return 'The product has been shipped. Check tracking details below.';
      case 'delivered':
        return 'Product delivered! You can now start creating your review content.';
      case 'review_submitted':
        return 'Your review has been submitted and is being reviewed.';
      case 'completed':
        return 'Job completed successfully. Payment has been processed.';
      default:
        return '';
    }
  };

  const canSubmitReview = (job: Order) => {
    return job.status === 'delivered' && !job.reviewSubmission;
  };

  const handleSubmitReview = (job: Order) => {
    setSubmittingReview(job);
  };

  const handleReviewSuccess = (jobId: string, reviewData: any) => {
    setOrders(orders.map(order => 
      order.id === jobId 
        ? { 
            ...order, 
            status: 'review_submitted',
            reviewSubmission: {
              mediaUrl: reviewData.mediaUrl,
              mediaType: reviewData.mediaType,
              submittedAt: new Date()
            }
          }
        : order
    ));
    setSubmittingReview(null);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600">Track your approved jobs and active orders</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">
                {approvedCampaigns.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Waiting Shipment</p>
              <p className="text-xl font-bold text-gray-900">
                {talentJobs.filter(j => j.status === 'pending_shipment').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-xl font-bold text-gray-900">
                {talentJobs.filter(j => j.status === 'shipped').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-500">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Ready to Review</p>
              <p className="text-xl font-bold text-gray-900">
                {talentJobs.filter(j => j.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">
                {talentJobs.filter(j => j.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Campaigns (Waiting for Order Creation) */}
      {approvedCampaigns.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Recently Approved Jobs</h3>
              <p className="text-green-700 text-sm">Congratulations! You've been approved for these campaigns. The founder will create orders soon.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {approvedCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                    <p className="text-gray-600 text-sm">{campaign.productName}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRateLevelColor(campaign.rateLevel)}`}>
                      {campaign.rateLevel} Star
                    </span>
                    <span className="text-xs text-gray-500">{campaign.category}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{campaign.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Approved recently</span>
                  </div>
                  <div className="flex items-center font-semibold text-green-600">
                    <span>{formatCurrency(campaign.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search jobs by campaign or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending_shipment">Waiting Shipment</option>
            <option value="shipped">In Transit</option>
            <option value="delivered">Ready to Review</option>
            <option value="review_submitted">Review Submitted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Active Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.campaignTitle}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span>{getStatusLabel(job.status)}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{getStatusDescription(job.status)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Product: <span className="font-medium text-gray-900">{job.productName}</span></p>
                      <p className="text-sm text-gray-600">Payout: <span className="font-medium text-green-600">{formatCurrency(job.payout)}</span></p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Created: {job.createdAt.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Order ID: #{job.id}</p>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  {job.deliveryInfo && job.status !== 'pending_shipment' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Delivery Information:</h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        {job.deliveryInfo.trackingNumber && (
                          <p><span className="font-medium">Tracking:</span> {job.deliveryInfo.trackingNumber}</p>
                        )}
                        {job.deliveryInfo.courier && (
                          <p><span className="font-medium">Courier:</span> {job.deliveryInfo.courier}</p>
                        )}
                        {job.deliveryInfo.address && (
                          <p><span className="font-medium">Delivery Address:</span> {job.deliveryInfo.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Review Submission Status */}
                  {job.reviewSubmission && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Review Submitted:</h4>
                      <p className="text-sm text-green-700">
                        Submitted on {job.reviewSubmission.submittedAt.toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        {job.reviewSubmission.mediaType === 'image' ? (
                          <img
                            src={job.reviewSubmission.mediaUrl}
                            alt="Review submission"
                            className="w-24 h-24 object-cover rounded-lg border border-green-200"
                          />
                        ) : (
                          <video
                            src={job.reviewSubmission.mediaUrl}
                            className="w-24 h-24 rounded-lg border border-green-200"
                            controls
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {canSubmitReview(job) && (
                    <button
                      onClick={() => handleSubmitReview(job)}
                      className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Submit Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {approvedCampaigns.length > 0 ? 'No active orders yet' : 'No jobs found'}
            </h3>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : approvedCampaigns.length > 0
                  ? 'Your approved jobs will become orders once founders ship the products'
                  : 'Jobs will appear here when founders approve your applications and create orders'
              }
            </p>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Submit Review Modal */}
      {submittingReview && (
        <SubmitReviewModal
          job={submittingReview}
          onClose={() => setSubmittingReview(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default MyJobsPage;