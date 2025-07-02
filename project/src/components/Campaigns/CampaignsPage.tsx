import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Pause, Play, Trash2, Clock, Users, CheckCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Campaign, Talent, Earning, Founder, Transaction } from '../../types';
import CampaignCard from './CampaignCard';
import CreateCampaignForm from './CreateCampaignForm';
import EditCampaignForm from './EditCampaignForm';
import CampaignApplicantsModal from './CampaignApplicantsModal';

const CampaignsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { campaigns, setCampaigns, orders, setOrders, earnings, setEarnings, transactions, setTransactions } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingApplicants, setViewingApplicants] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock talent data - in real app, this would come from API
  const mockTalents: Talent[] = [
    {
      id: '3',
      email: 'talent@example.com',
      name: 'Jane Talent',
      role: 'talent',
      status: 'active',
      bio: 'Content creator with 100k followers specializing in tech reviews and lifestyle content. I create engaging videos and photos that drive real results for brands.',
      portfolio: [
        'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 2,
      skills: ['Photography', 'Video Creation', 'Tech Reviews', 'Social Media'],
      socialMedia: {
        instagram: '@jane_talent',
        youtube: 'Jane Talent Channel',
      },
      totalEarnings: 2500,
      createdAt: new Date('2023-06-15'),
    },
    {
      id: '4',
      email: 'sarah.creator@example.com',
      name: 'Sarah Johnson',
      role: 'talent',
      status: 'active',
      bio: 'Fashion and beauty content creator with expertise in lifestyle photography. I help brands showcase their products through authentic, engaging content.',
      portfolio: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 1,
      skills: ['Fashion Photography', 'Beauty Content', 'Lifestyle', 'Instagram Marketing'],
      socialMedia: {
        instagram: '@sarah_creates',
      },
      totalEarnings: 1200,
      createdAt: new Date('2023-08-20'),
    },
    {
      id: '5',
      email: 'mike.gamer@example.com',
      name: 'Mike Chen',
      role: 'talent',
      status: 'active',
      bio: 'Gaming content creator and tech enthusiast. I specialize in gaming gear reviews, tech unboxings, and creating viral gaming content.',
      portfolio: [
        'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 3,
      skills: ['Gaming Content', 'Tech Reviews', 'Video Editing', 'Streaming'],
      socialMedia: {
        youtube: 'Mike Gaming Channel',
        instagram: '@mike_games',
      },
      totalEarnings: 4500,
      createdAt: new Date('2023-03-10'),
    },
  ];

  // Filter campaigns for the current founder
  const founderCampaigns = campaigns.filter(campaign => campaign.founderId === user?.id);

  // Apply search and status filters
  const filteredCampaigns = founderCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleEditSuccess = () => {
    setEditingCampaign(null);
  };

  const handleStatusChange = (campaignId: string, newStatus: 'active' | 'paused') => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus }
        : campaign
    ));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleViewApplicants = (campaign: Campaign) => {
    setViewingApplicants(campaign);
  };

  const handleApproveApplicant = (talentId: string) => {
    if (!viewingApplicants) return;
    
    const founder = user as Founder;
    const campaignPrice = viewingApplicants.price;
    
    // Check if founder has sufficient balance
    if (founder.walletBalance < campaignPrice) {
      alert('Insufficient wallet balance. Please top up your wallet before approving talents.');
      return;
    }

    // Update campaign: remove from applicants, add to approved talents
    setCampaigns(campaigns.map(campaign => 
      campaign.id === viewingApplicants.id
        ? {
            ...campaign,
            applicants: campaign.applicants.filter(id => id !== talentId),
            approvedTalents: [...campaign.approvedTalents, talentId]
          }
        : campaign
    ));

    // Deduct amount from founder's wallet immediately (put on hold)
    if (updateProfile) {
      const updatedFounder: Founder = {
        ...founder,
        walletBalance: founder.walletBalance - campaignPrice,
      };
      updateProfile(updatedFounder);
    }

    // Create hold transaction record
    const holdTransaction: Transaction = {
      id: Date.now().toString(),
      userId: founder.id,
      type: 'debit',
      amount: campaignPrice,
      description: `Payment Hold - ${viewingApplicants.title} (Talent Approved)`,
      relatedJobId: `hold_${viewingApplicants.id}_${talentId}`,
      createdAt: new Date(),
    };

    setTransactions([holdTransaction, ...transactions]);

    // Create new order
    const talent = mockTalents.find(t => t.id === talentId);
    if (talent) {
      const newOrder = {
        id: Date.now().toString(),
        campaignId: viewingApplicants.id,
        talentId: talentId,
        founderId: user?.id || '',
        talentName: talent.name,
        campaignTitle: viewingApplicants.title,
        productName: viewingApplicants.productName,
        status: 'pending_shipment' as const,
        payout: viewingApplicants.price,
        createdAt: new Date(),
        deliveryInfo: {
          address: '',
          trackingNumber: '',
          courier: ''
        }
      };
      
      setOrders([...orders, newOrder]);

      // Create earning record for talent (pending status)
      const newEarning: Earning = {
        id: Date.now().toString(),
        talentId: talentId,
        orderId: newOrder.id,
        campaignTitle: viewingApplicants.title,
        amount: viewingApplicants.price,
        status: 'pending',
        earnedAt: new Date(),
      };

      setEarnings([...earnings, newEarning]);
    }

    // Update the viewing applicants state to reflect changes
    setViewingApplicants({
      ...viewingApplicants,
      applicants: viewingApplicants.applicants.filter(id => id !== talentId),
      approvedTalents: [...viewingApplicants.approvedTalents, talentId]
    });
  };

  const handleRejectApplicant = (talentId: string) => {
    if (!viewingApplicants) return;
    
    setCampaigns(campaigns.map(campaign => 
      campaign.id === viewingApplicants.id
        ? {
            ...campaign,
            applicants: campaign.applicants.filter(id => id !== talentId)
          }
        : campaign
    ));

    // Update the viewing applicants state
    setViewingApplicants({
      ...viewingApplicants,
      applicants: viewingApplicants.applicants.filter(id => id !== talentId)
    });
  };

  const getApplicantTalents = (campaign: Campaign): Talent[] => {
    return mockTalents.filter(talent => campaign.applicants.includes(talent.id));
  };

  const getApprovedTalents = (campaign: Campaign): Talent[] => {
    return mockTalents.filter(talent => campaign.approvedTalents.includes(talent.id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case '30sec':
        return '30 Seconds';
      case '1min':
        return '1 Minute';
      case '3min':
        return '3 Minutes';
      default:
        return duration;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-gray-600">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Payment Hold Info Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <DollarSign className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Payment Hold System</h4>
            <p className="text-sm text-yellow-700">
              When you approve a talent application, the campaign amount will be immediately deducted from your wallet and held until the review is completed. 
              Payment will be released to the talent only after you approve their submitted content.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {founderCampaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Pause className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paused</p>
              <p className="text-2xl font-bold text-gray-900">
                {founderCampaigns.filter(c => c.status === 'paused').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">
                {founderCampaigns.reduce((total, campaign) => total + campaign.applicants.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(founderCampaigns.reduce((total, campaign) => total + campaign.price, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search campaigns..."
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
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length > 0 ? (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const approvedTalents = getApprovedTalents(campaign);
            
            return (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                      {campaign.approvedTalents.length > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {campaign.approvedTalents.length} Approved
                        </span>
                      )}
                      {campaign.applicants.length > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {campaign.applicants.length} Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <span>Product: {campaign.productName}</span>
                      <span>Category: {campaign.category}</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Duration: {getDurationLabel(campaign.duration)}</span>
                      </div>
                      <span>Rate Level: {campaign.rateLevel} Star</span>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Applicants: {campaign.applicants.length}</span>
                      </div>
                      <div className="flex items-center font-semibold text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{formatCurrency(campaign.price)}</span>
                      </div>
                    </div>

                    {/* Approved Talents Display */}
                    {approvedTalents.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-800 mb-2">Approved Talents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {approvedTalents.map((talent) => (
                            <div key={talent.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-green-200">
                              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {talent.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-green-800 font-medium">{talent.name}</span>
                              <span className="text-xs text-green-600">({talent.rateLevel} ⭐)</span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                {formatCurrency(campaign.price)} held
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {campaign.applicants.length > 0 && (
                      <button
                        onClick={() => handleViewApplicants(campaign)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
                        title="View Applicants"
                      >
                        <Users className="h-4 w-4" />
                        {campaign.applicants.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {campaign.applicants.length}
                          </span>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => console.log('View campaign details')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleEditCampaign(campaign)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {campaign.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(campaign.id, 'paused')}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Pause Campaign"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(campaign.id, 'active')}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate Campaign"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
            <p className="text-sm mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first campaign to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Campaign</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <CreateCampaignForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <EditCampaignForm
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* View Applicants Modal */}
      {viewingApplicants && (
        <CampaignApplicantsModal
          campaign={viewingApplicants}
          applicants={getApplicantTalents(viewingApplicants)}
          onClose={() => setViewingApplicants(null)}
          onApproveApplicant={handleApproveApplicant}
          onRejectApplicant={handleRejectApplicant}
        />
      )}
    </div>
  );
};

export default CampaignsPage;