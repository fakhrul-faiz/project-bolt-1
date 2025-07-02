import React, { useState } from 'react';
import { X, Users, Star, Eye, Check, XCircle, Search } from 'lucide-react';
import { Campaign, Talent } from '../../types';
import TalentProfileModal from './TalentProfileModal';

interface CampaignApplicantsModalProps {
  campaign: Campaign;
  applicants: Talent[];
  onClose: () => void;
  onApproveApplicant: (talentId: string) => void;
  onRejectApplicant: (talentId: string) => void;
}

const CampaignApplicantsModal: React.FC<CampaignApplicantsModalProps> = ({
  campaign,
  applicants,
  onClose,
  onApproveApplicant,
  onRejectApplicant,
}) => {
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplicants = applicants.filter(talent =>
    talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleApprove = (talentId: string) => {
    onApproveApplicant(talentId);
    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent(null);
    }
  };

  const handleReject = (talentId: string) => {
    onRejectApplicant(talentId);
    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaign Applicants</h2>
              <p className="text-gray-600">{campaign.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Campaign Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{campaign.title}</h3>
                  <p className="text-blue-700 text-sm">{campaign.productName} • {campaign.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">{applicants.length} Applicants</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search applicants by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Applicants List */}
            {filteredApplicants.length > 0 ? (
              <div className="space-y-4">
                {filteredApplicants.map((talent) => (
                  <div key={talent.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {talent.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{talent.name}</h4>
                          <p className="text-gray-600 text-sm">{talent.email}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRateLevelColor(talent.rateLevel)}`}>
                              {talent.rateLevel} Star
                            </span>
                            <span className="text-xs text-gray-500">
                              ${talent.totalEarnings.toLocaleString()} earned
                            </span>
                            {talent.skills.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {talent.skills.slice(0, 2).join(', ')}
                                {talent.skills.length > 2 && ` +${talent.skills.length - 2}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTalent(talent)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleApprove(talent.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Application"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleReject(talent.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Application"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Talent Bio Preview */}
                    {talent.bio && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-700 text-sm line-clamp-2">{talent.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No matching applicants' : 'No applicants yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Applicants will appear here when talents apply to your campaign'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Talent Profile Modal */}
      {selectedTalent && (
        <TalentProfileModal
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
          onApprove={() => handleApprove(selectedTalent.id)}
          onReject={() => handleReject(selectedTalent.id)}
        />
      )}
    </>
  );
};

export default CampaignApplicantsModal;