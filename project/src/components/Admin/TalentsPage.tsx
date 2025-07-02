import React, { useState } from 'react';
import { Star, Search, Filter, Eye, Ban, CheckCircle, Mail, Calendar, DollarSign, MoreVertical, Award, Users } from 'lucide-react';
import TalentDetailsModal from './TalentDetailsModal';

interface Talent {
  id: string;
  email: string;
  name: string;
  role: 'talent';
  status: 'active' | 'pending' | 'suspended';
  bio?: string;
  portfolio: string[];
  rateLevel: 1 | 2 | 3;
  skills: string[];
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  createdAt: Date;
  lastLogin?: Date;
}

const TalentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rateLevelFilter, setRateLevelFilter] = useState<string>('all');
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  // Mock talents data - in real app, this would come from API
  const mockTalents: Talent[] = [
    {
      id: '3',
      email: 'talent@example.com',
      name: 'Jane Talent',
      role: 'talent',
      status: 'active',
      bio: 'Content creator with 100k followers specializing in tech reviews and lifestyle content.',
      portfolio: [
        'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 2,
      skills: ['Photography', 'Video Creation', 'Tech Reviews', 'Social Media'],
      socialMedia: {
        instagram: '@jane_talent',
        youtube: 'Jane Talent Channel',
      },
      totalEarnings: 2500,
      completedJobs: 15,
      averageRating: 4.8,
      createdAt: new Date('2023-06-15'),
      lastLogin: new Date('2024-01-25'),
    },
    {
      id: '4',
      email: 'sarah.creator@example.com',
      name: 'Sarah Johnson',
      role: 'talent',
      status: 'active',
      bio: 'Fashion and beauty content creator with expertise in lifestyle photography.',
      portfolio: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 1,
      skills: ['Fashion Photography', 'Beauty Content', 'Lifestyle', 'Instagram Marketing'],
      socialMedia: {
        instagram: '@sarah_creates',
      },
      totalEarnings: 1200,
      completedJobs: 8,
      averageRating: 4.6,
      createdAt: new Date('2023-08-20'),
      lastLogin: new Date('2024-01-24'),
    },
    {
      id: '5',
      email: 'mike.gamer@example.com',
      name: 'Mike Chen',
      role: 'talent',
      status: 'active',
      bio: 'Gaming content creator and tech enthusiast specializing in gaming gear reviews.',
      portfolio: [
        'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 3,
      skills: ['Gaming Content', 'Tech Reviews', 'Video Editing', 'Streaming'],
      socialMedia: {
        youtube: 'Mike Gaming Channel',
        instagram: '@mike_games',
      },
      totalEarnings: 4500,
      completedJobs: 25,
      averageRating: 4.9,
      createdAt: new Date('2023-03-10'),
      lastLogin: new Date('2024-01-23'),
    },
    {
      id: '9',
      email: 'alex.fitness@example.com',
      name: 'Alex Rodriguez',
      role: 'talent',
      status: 'pending',
      bio: 'Fitness influencer and health coach creating motivational content.',
      portfolio: [
        'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      rateLevel: 1,
      skills: ['Fitness Content', 'Health Coaching', 'Motivation', 'Workout Videos'],
      socialMedia: {
        instagram: '@alex_fitness',
      },
      totalEarnings: 0,
      completedJobs: 0,
      averageRating: 0,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '10',
      email: 'emma.food@example.com',
      name: 'Emma Wilson',
      role: 'talent',
      status: 'suspended',
      bio: 'Food blogger and recipe creator with a passion for healthy cooking.',
      portfolio: [],
      rateLevel: 2,
      skills: ['Food Photography', 'Recipe Creation', 'Cooking Videos', 'Nutrition'],
      socialMedia: {
        instagram: '@emma_eats',
        youtube: 'Emma\'s Kitchen',
      },
      totalEarnings: 800,
      completedJobs: 5,
      averageRating: 4.2,
      createdAt: new Date('2023-11-15'),
      lastLogin: new Date('2024-01-10'),
    },
  ];

  const [talents, setTalents] = useState<Talent[]>(mockTalents);

  // Apply search and filters
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || talent.status === statusFilter;
    const matchesRateLevel = rateLevelFilter === 'all' || talent.rateLevel.toString() === rateLevelFilter;
    
    return matchesSearch && matchesStatus && matchesRateLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Calendar className="h-4 w-4" />;
      case 'suspended':
        return <Ban className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (talentId: string, newStatus: 'active' | 'suspended') => {
    setTalents(talents.map(talent => 
      talent.id === talentId 
        ? { ...talent, status: newStatus }
        : talent
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talents Management</h1>
          <p className="text-gray-600">Manage talent accounts and monitor their performance</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Talents</p>
              <p className="text-2xl font-bold text-gray-900">
                {talents.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {talents.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(talents.reduce((sum, t) => sum + t.totalEarnings, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(talents.filter(t => t.averageRating > 0).reduce((sum, t) => sum + t.averageRating, 0) / 
                  talents.filter(t => t.averageRating > 0).length || 0).toFixed(1)}
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
            placeholder="Search talents by name, email, or skills..."
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
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select
            value={rateLevelFilter}
            onChange={(e) => setRateLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="1">1 Star</option>
            <option value="2">2 Star</option>
            <option value="3">3 Star</option>
          </select>
        </div>
      </div>

      {/* Talents List */}
      {filteredTalents.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTalents.map((talent) => (
                  <tr key={talent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {talent.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{talent.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {talent.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(talent.status)}`}>
                        {getStatusIcon(talent.status)}
                        <span className="ml-1 capitalize">{talent.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRateLevelColor(talent.rateLevel)}`}>
                        <Star className="h-3 w-3 mr-1" />
                        {talent.rateLevel} Star
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{talent.completedJobs} jobs</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {talent.averageRating > 0 ? talent.averageRating.toFixed(1) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{formatCurrency(talent.totalEarnings)}</div>
                      <div className="text-sm text-gray-500">
                        {talent.completedJobs > 0 ? `Avg: ${formatCurrency(talent.totalEarnings / talent.completedJobs)}` : 'No jobs'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {talent.lastLogin ? `${getDaysAgo(talent.lastLogin)} days ago` : 'Never'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {getDaysAgo(talent.createdAt)} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedTalent(talent)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {talent.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(talent.id, 'suspended')}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend Account"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : talent.status === 'suspended' ? (
                          <button
                            onClick={() => handleStatusChange(talent.id, 'active')}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate Account"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(talent.id, 'active')}
                            className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No talents found</h3>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' || rateLevelFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No talents have registered yet'
              }
            </p>
          </div>
        </div>
      )}

      {/* Talent Details Modal */}
      {selectedTalent && (
        <TalentDetailsModal
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default TalentsPage;