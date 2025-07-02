import React, { useState, useRef, useEffect } from 'react';
import { X, Package, User, Calendar, DollarSign, FileText, Download, ThumbsUp, ThumbsDown, Star, Clock, Send, MessageCircle, Paperclip, Image, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Order, Message } from '../../types';

interface ReviewDetailsModalProps {
  review: Order;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({ 
  review, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const { user } = useAuth();
  const { messages, setMessages } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter messages for this specific order/job
  const orderMessages = messages.filter(msg => msg.jobId === review.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [orderMessages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'review_submitted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Awaiting Review';
      case 'review_submitted':
        return 'Review Submitted';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      jobId: review.id,
      senderId: user!.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate talent typing response after founder sends message
    if (user?.role === 'founder') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add automatic talent response for demo
        const talentResponse: Message = {
          id: (Date.now() + 1).toString(),
          jobId: review.id,
          senderId: review.talentId,
          content: getAutoResponse(),
          timestamp: new Date(),
          read: false,
        };
        setMessages(prev => [...prev, talentResponse]);
      }, 2000);
    }
  };

  const getAutoResponse = () => {
    const responses = [
      "Thank you for the feedback! I'll make the adjustments you mentioned.",
      "Got it! I'll work on improving the lighting in the next version.",
      "Thanks for the quick response. I'll submit the revised content soon.",
      "Understood! I'll focus more on the product features as requested.",
      "Perfect! I'm glad you're happy with the content quality.",
      "I'll make sure to highlight those key points in the revision.",
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
        jobId: review.id,
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

  const handleApprove = () => {
    // Send approval message
    const approvalMessage: Message = {
      id: Date.now().toString(),
      jobId: review.id,
      senderId: user!.id,
      content: "✅ Review approved! Great work on this content. The job is now completed.",
      timestamp: new Date(),
      read: false,
    };
    setMessages([...messages, approvalMessage]);
    
    onApprove?.();
    onClose();
  };

  const handleReject = () => {
    // Send rejection message
    const rejectionMessage: Message = {
      id: Date.now().toString(),
      jobId: review.id,
      senderId: user!.id,
      content: "🔄 Requesting revision on the submitted content. Please check the feedback above and resubmit.",
      timestamp: new Date(),
      read: false,
    };
    setMessages([...messages, rejectionMessage]);
    
    onReject?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Review Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{review.campaignTitle}</h3>
                <p className="text-gray-600">Order #{review.id}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(review.status)}`}>
                {getStatusLabel(review.status)}
              </span>
            </div>

            {/* Review Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium text-gray-900">{review.productName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Talent</p>
                    <p className="font-medium text-gray-900">{review.talentName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payout</p>
                    <p className="font-medium text-green-600">RM{review.payout}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Created</p>
                    <p className="font-medium text-gray-900">{review.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>

                {review.reviewSubmission && (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Review Submitted</p>
                      <p className="font-medium text-gray-900">
                        {review.reviewSubmission.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Product Delivered</p>
                    <p className="text-sm text-gray-600">Product successfully delivered to talent</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    review.reviewSubmission 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Content</p>
                    <p className="text-sm text-gray-600">
                      {review.reviewSubmission 
                        ? `${review.reviewSubmission.mediaType} content submitted` 
                        : 'Waiting for talent to submit review content'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    review.status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : review.status === 'review_submitted'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Approval</p>
                    <p className="text-sm text-gray-600">
                      {review.status === 'completed' 
                        ? 'Review approved and job completed' 
                        : review.status === 'review_submitted'
                          ? 'Pending your approval'
                          : 'Waiting for review submission'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            {review.reviewSubmission && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Submitted Review Content</h4>
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {review.reviewSubmission.mediaType === 'image' ? (
                        <img
                          src={review.reviewSubmission.mediaUrl}
                          alt="Review submission"
                          className="w-48 h-48 object-cover rounded-lg border border-green-200"
                        />
                      ) : (
                        <video
                          src={review.reviewSubmission.mediaUrl}
                          controls
                          className="w-48 h-48 rounded-lg border border-green-200"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800 capitalize">
                          {review.reviewSubmission.mediaType} Review
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mb-3">
                        Submitted on {review.reviewSubmission.submittedAt.toLocaleDateString()} at{' '}
                        {review.reviewSubmission.submittedAt.toLocaleTimeString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(review.reviewSubmission!.mediaUrl, '_blank')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            
            {review.status === 'review_submitted' && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>Request Revision</span>
                </button>
                
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Approve Review</span>
                </button>
              </>
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
                <h3 className="font-semibold text-gray-900">Chat with {review.talentName}</h3>
                <p className="text-sm text-gray-600">Discuss review progress</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {orderMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs">Start a conversation with the talent</p>
              </div>
            ) : (
              <>
                {orderMessages.map((message, index) => {
                  const isFounder = message.senderId === user?.id;
                  const showDate = index === 0 || 
                    formatDate(new Date(message.timestamp)) !== formatDate(new Date(orderMessages[index - 1].timestamp));

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {formatDate(new Date(message.timestamp))}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isFounder ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isFounder 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isFounder ? 'text-blue-100' : 'text-gray-500'
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
                  onClick={() => setNewMessage("Could you please adjust the lighting in the video?")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  💡 Lighting
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage("Great work! The content looks perfect.")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  👍 Looks good
                </button>
                <button
                  type="button"
                  onClick={() => setNewMessage("Can you highlight the key features more?")}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ⭐ Features
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

export default ReviewDetailsModal;