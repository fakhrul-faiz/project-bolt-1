import React from 'react';
import { X, Package, User, Calendar, DollarSign, MapPin, Truck } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_shipment':
        return 'Pending Shipment';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'review_submitted':
        return 'Review Submitted';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{order.campaignTitle}</h3>
              <p className="text-gray-600">Order #{order.id}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="font-medium text-gray-900">{order.productName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Talent</p>
                  <p className="font-medium text-gray-900">{order.talentName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Payout</p>
                  <p className="font-medium text-green-600">${order.payout}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">{order.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {order.deliveryInfo && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h4>
              
              {order.deliveryInfo.address && (
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-gray-900">{order.deliveryInfo.address}</p>
                  </div>
                </div>
              )}

              {order.deliveryInfo.trackingNumber && (
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-medium text-gray-900">{order.deliveryInfo.trackingNumber}</p>
                  </div>
                </div>
              )}

              {order.deliveryInfo.courier && (
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Courier</p>
                    <p className="font-medium text-gray-900">{order.deliveryInfo.courier}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Review Submission */}
          {order.reviewSubmission && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Review Submission</h4>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-2">
                  Review submitted on {order.reviewSubmission.submittedAt.toLocaleDateString()}
                </p>
                <div className="mt-3">
                  {order.reviewSubmission.mediaType === 'image' ? (
                    <img
                      src={order.reviewSubmission.mediaUrl}
                      alt="Review submission"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={order.reviewSubmission.mediaUrl}
                      controls
                      className="w-full max-w-md h-48 rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;