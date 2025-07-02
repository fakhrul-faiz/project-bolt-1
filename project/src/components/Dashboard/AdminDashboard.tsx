import React from 'react';
import { Users, Star, Megaphone, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Total Founders', value: '24', icon: Users, color: 'bg-blue-500' },
    { name: 'Active Talents', value: '156', icon: Star, color: 'bg-purple-500' },
    { name: 'Active Campaigns', value: '43', icon: Megaphone, color: 'bg-green-500' },
    { name: 'Monthly Revenue', value: 'RM12,430', icon: DollarSign, color: 'bg-yellow-500' },
  ];

  const recentActivity = [
    { id: 1, type: 'talent_approval', message: 'New talent application from Sarah Johnson', time: '2 hours ago' },
    { id: 2, type: 'campaign_created', message: 'Tech Startup Inc created a new campaign', time: '4 hours ago' },
    { id: 3, type: 'payout_completed', message: 'Payout of RM250 completed for Campaign #12', time: '6 hours ago' },
    { id: 4, type: 'founder_registered', message: 'New founder registration: Fashion Brand Co', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage the GambarKaca platform</p>
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

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-64 bg-gradient-to-t from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Revenue chart will be implemented here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800">Talent Applications</h4>
            <p className="text-2xl font-bold text-yellow-900">12</p>
            <p className="text-sm text-yellow-700">Awaiting review</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800">Campaign Approvals</h4>
            <p className="text-2xl font-bold text-blue-900">7</p>
            <p className="text-sm text-blue-700">Pending approval</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800">Payout Requests</h4>
            <p className="text-2xl font-bold text-green-900">23</p>
            <p className="text-sm text-green-700">Ready for processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;