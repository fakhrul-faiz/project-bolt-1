import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Ban, CheckCircle, Building, Mail, Phone, Wallet, Calendar, MoreVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import FounderDetailsModal from './FounderDetailsModal';

interface Founder {
  id: string;
  email: string;
  name: string;
  role: 'founder';
  status: 'active' | 'pending' | 'suspended';
  company?: string;
  phone?: string;
  address?: string;
  walletBalance: number;
  totalCampaigns: number;
  totalSpent: number;
  createdAt: Date;
  lastLogin?: Date;
}

const FoundersPage: React.FC = () => {
  const { campaigns } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);

  // Mock founders data - in real app, this would come from API
  const mockFounders: Founder[] = [
    {
      id: '2',
      email: 'founder@example.com',
      name: 'John Founder',
      role: 'founder',
      status: 'active',
      company: 'Tech Startup Inc',
      phone: '+1234567890',
      address: '123 Business St, San Francisco, CA',
      walletBalance: 5000,
      totalCampaigns: 4,
      totalSpent: 2800,
      createdAt: new Date('2023-06-15'),
      lastLogin: new Date('2024-01-25'),
    },
    {
      id: '6',
      email: 'sarah.brand@example.com',
      name: 'Sarah Wilson',
      role: 'founder',
      status: 'active',
      company: 'Fashion Brand Co',
      phone: '+1987654321',
      address: '456 Fashion Ave, New York, NY',
      walletBalance: 3200,
      totalCampaigns: 2,
      totalSpent: 1500,
      createdAt: new Date('2023-08-20'),
      lastLogin: new Date('2024-01-24'),
    },
    {
      id: '7',
      email: 'mike.startup@example.com',
      name: 'Mike Chen',
      role: 'founder',
      status: 'pending',
      company: 'Organic Foods Ltd',
      phone: '+1555123456',
      address: '789 Health St, Austin, TX',
      walletBalance: 1000,
      totalCampaigns: 0,
      totalSpent: 0,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '8',
      email: 'lisa.corp@example.com',
      name: 'Lisa Rodriguez',
      role: 'founder',
      status: 'suspended',
      company: 'Gaming Corp',
      phone: '+1444987654',
      address: '321 Game St, Seattle, WA',
      walletBalance: 500,
      totalCampaigns: 1,
      totalSpent: 800,
      createdAt: new Date('2023-12-10'),
      lastLogin: new Date('2024-01-15'),
    },
  ];

  const [founders, setFounders] = useState<Founder[]>(mockFounders);

  // Apply search and status filters
  const filteredFounders = founders.filter(founder => {
    const matchesSearch = founder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         founder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         founder.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || founder.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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

  const handleStatusChange = (founderId: string, newStatus: 'active' | 'suspended') => {
    setFounders(founders.map(founder => 
      founder.id === founderId 
        ? { ...founder, status: newStatus }
        : founder
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
          <h1 className="text-2xl font-bold text-gray-900">Founders Management</h1>
          <p className="text-gray-600">Manage founder accounts and monitor their activities</p>
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
              <p className="text-sm font-medium text-gray-600">Active Founders</p>
              <p className="text-2xl font-bold text-gray-900">
                {founders.filter(f => f.status === 'active').length}
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
                {founders.filter(f => f.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(founders.reduce((sum, f) => sum + f.walletBalance, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">
                {founders.filter(f => f.company).length}
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
            placeholder="Search founders by name, email, or company..."
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
        </div>
      </div>

      {/* Founders List */}
      {filteredFounders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Founder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaigns
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Balance
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
                {filteredFounders.map((founder) => (
                  <tr key={founder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {founder.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{founder.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {founder.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{founder.company || 'N/A'}</div>
                      {founder.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {founder.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(founder.status)}`}>
                        {getStatusIcon(founder.status)}
                        <span className="ml-1 capitalize">{founder.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{founder.totalCampaigns}</div>
                      <div className="text-sm text-gray-500">campaigns</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{formatCurrency(founder.walletBalance)}</div>
                      <div className="text-sm text-gray-500">Spent: {formatCurrency(founder.totalSpent)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {founder.lastLogin ? `${getDaysAgo(founder.lastLogin)} days ago` : 'Never'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {getDaysAgo(founder.createdAt)} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedFounder(founder)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {founder.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(founder.id, 'suspended')}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend Account"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : founder.status === 'suspended' ? (
                          <button
                            onClick={() => handleStatusChange(founder.id, 'active')}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate Account"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(founder.id, 'active')}
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
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No founders found</h3>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No founders have registered yet'
              }
            </p>
          </div>
        </div>
      )}

      {/* Founder Details Modal */}
      {selectedFounder && (
        <FounderDetailsModal
          founder={selectedFounder}
          onClose={() => setSelectedFounder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default FoundersPage;