import React, { useState, useRef, useEffect } from 'react';
import { X, Package, Calendar, DollarSign, MapPin, Truck, CheckCircle, Send, MessageCircle, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Order, Message } from '../../types';

interface JobDetailsModalProps {
  job: Order;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const { user } = useAuth();
  const { messages, setMessages } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter messages for this specific job
  const jobMessages = messages.filter(msg => msg.jobId === job.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [jobMessages]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      jobId: job.id,
      senderId: user!.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate founder typing response after talent sends message
    if (user?.role === 'talent') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add automatic founder response for demo
        const founderResponse: Message = {
          id: (Date.now() + 1).toString(),
          jobId: job.id,
          senderId: job.founderId,
          content: getAutoResponse(),
          timestamp: new Date(),
          read: false,
        };
        setMessages(prev => [...prev, founderResponse]);
      }, 2000);
    }
  };

  const getAutoResponse = () => {
    const responses = [
      "Thanks for the update! Looking forward to seeing your content.",
      "Great! Let me know if you need any clarification on the requirements.",
      "Perfect! Take your time to create quality content.",
      "Sounds good! Feel free to reach out if you have any questions.",
      "Excellent! I'm excited to see the final result.",
      "Thank you for keeping me informed about the progress.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and get a URL
      const message: Message = {
        id: Date.now().toString(),
        jobId: job.id,
        senderId: user!.id,
        content: `📎 Shared a file: ${file.name}`,
        timestamp: new Date(),
        read: false,
      };
      setMessages([...messages, message]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Job Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Job Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.campaignTitle}</h3>
                <p className="text-gray-600">Job #{job.id}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>

            {/* Job Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium text-gray-900">{job.productName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payout</p>
                    <p className="font-medium text-green-600">{formatCurrency(job.payout)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Job Started</p>
                    <p className="font-medium text-gray-900">{job.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Progress</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['pending_shipment', 'shipped', 'delivered', 'review_submitted', 'completed'].includes(job.status)
                      ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Job Assigned</p>
                    <p className="text-sm text-gray-600">You were approved for this campaign</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['shipped', 'delivered', 'review_submitted', 'completed'].includes(job.status)
                      ? 'bg-green-500 text-white' : job.status === 'pending_shipment' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Product Shipped</p>
                    <p className="text-sm text-gray-600">
                      {job.status === 'pending_shipment' ? 'Waiting for shipment' : 'Product has been shipped to you'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['delivered', 'review_submitted', 'completed'].includes(job.status)
                      ? 'bg-green-500 text-white' : job.status === 'shipped' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Product Delivered</p>
                    <p className="text-sm text-gray-600">
                      {['delivered', 'review_submitted', 'completed'].includes(job.status) 
                        ? 'Product delivered successfully' 
                        : job.status === 'shipped' 
                          ? 'Product is in transit' 
                          : 'Waiting for delivery'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['review_submitted', 'completed'].includes(job.status)
                      ? 'bg-green-500 text-white' : job.status === 'delivered' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Submitted</p>
                    <p className="text-sm text-gray-600">
                      {['review_submitted', 'completed'].includes(job.status) 
                        ? 'Review content submitted for approval' 
                        : job.status === 'delivered' 
                          ? 'Ready to create and submit review' 
                          : 'Waiting for product delivery'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            {job.deliveryInfo && job.status !== 'pending_shipment' && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h4>
                
                {job.deliveryInfo.trackingNumber && (
                  <div className="flex items-center space-x-3 mb-4">
                    <Truck className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900">{job.deliveryInfo.trackingNumber}</p>
                    </div>
                  </div>
                )}

                {job.deliveryInfo.courier && (
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Courier</p>
                      <p className="font-medium text-gray-900">{job.deliveryInfo.courier}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Submission */}
            {job.reviewSubmission && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Review Submission</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-2">
                    Review submitted on {job.reviewSubmission.submittedAt.toLocaleDateString()}
                  </p>
                  <div className="mt-3">
                    {job.reviewSubmission.mediaType === 'image' ? (
                      <img
                        src={job.reviewSubmission.mediaUrl}
                        alt="Review submission"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={job.reviewSubmission.mediaUrl}
                        controls
                        className="w-full max-w-md h-48 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Messaging */}
        <div className="w-96 border-l border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Chat with Founder</h3>
                <p className="text-sm text-gray-600">Discuss job progress</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {jobMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs">Start a conversation with the founder</p>
              </div>
            ) : (
              <>
                {jobMessages.map((message, index) => {
                  const isTalent = message.senderId === user?.id;
                  const showDate = index === 0 || 
                    formatDate(new Date(message.timestamp)) !== formatDate(new Date(jobMessages[index - 1].timestamp));

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {formatDate(new Date(message.timestamp))}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isTalent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isTalent 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isTalent ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(new Date(message.timestamp))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFileAttachment}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Attach File"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setNewMessage("I've received the product and will start working on the review.")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  📦 Received
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage("I have a question about the requirements.")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ❓ Question
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage("The review content is ready for submission!")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ✅ Ready
                </button>
              </div>
            </form>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;