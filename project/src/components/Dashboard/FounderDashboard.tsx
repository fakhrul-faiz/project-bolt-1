import React from 'react';
import { Megaphone, Package, FileText, DollarSign, Users, TrendingUp } from 'lucide-react';

const FounderDashboard: React.FC = () => {
  const stats = [
    { name: 'Active Campaigns', value: '3', icon: Megaphone, color: 'bg-blue-500' },
    { name: 'Total Orders', value: '18', icon: Package, color: 'bg-green-500' },
    { name: 'Completed Reviews', value: '12', icon: FileText, color: 'bg-purple-500' },
    { name: 'Wallet Balance', value: 'RM2,450', icon: DollarSign, color: 'bg-yellow-500' },
  ];

  const recentCampaigns = [
    { id: 1, name: 'Tech Product Launch', status: 'Active', applicants: 8, budget: 'RM1000' },
    { id: 2, name: 'Fashion Collection', status: 'Completed', applicants: 5, budget: 'RM750' },
    { id: 3, name: 'Food Review Campaign', status: 'Paused', applicants: 12, budget: 'RM500' },
  ];

  const recentOrders = [
    { id: 1, talent: 'Sarah Johnson', product: 'SmartApp Pro', status: 'Shipped', date: '2024-01-15' },
    { id: 2, talent: 'Mike Chen', product: 'Fashion Jacket', status: 'Review Submitted', date: '2024-01-14' },
    { id: 3, talent: 'Lisa Wang', product: 'Organic Snacks', status: 'Completed', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Founder Dashboard</h1>
        <p className="text-gray-600">Manage your campaigns and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-64 bg-gradient-to-t from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance chart will be implemented here</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
          <div className="space-y-3">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                  <p className="text-sm text-gray-600">{campaign.applicants} applicants • {campaign.budget}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.talent}</p>
                  <p className="text-sm text-gray-600">{order.product} • {order.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'Review Submitted' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;