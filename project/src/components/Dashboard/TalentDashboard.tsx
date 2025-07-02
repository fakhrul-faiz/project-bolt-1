import React from 'react';
import { Briefcase, DollarSign, Star, TrendingUp, Calendar, Award } from 'lucide-react';

const TalentDashboard: React.FC = () => {
  const stats = [
    { name: 'Active Jobs', value: '4', icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Total Earnings', value: 'RM1,250', icon: DollarSign, color: 'bg-green-500' },
    { name: 'Reviews Completed', value: '23', icon: Star, color: 'bg-purple-500' },
    { name: 'Success Rate', value: '94%', icon: Award, color: 'bg-yellow-500' },
  ];

  const activeJobs = [
    { id: 1, campaign: 'Tech Product Launch', brand: 'Tech Startup Inc', deadline: '2024-01-25', status: 'In Progress', payout: 'RM150' },
    { id: 2, campaign: 'Fashion Collection', brand: 'Fashion Brand Co', deadline: '2024-01-28', status: 'Shipped', payout: 'RM200' },
    { id: 3, campaign: 'Food Review', brand: 'Organic Foods', deadline: '2024-01-30', status: 'Review Due', payout: 'RM100' },
  ];

  const recentEarnings = [
    { id: 1, campaign: 'Beauty Product Review', amount: 'RM180', date: '2024-01-20', status: 'Completed' },
    { id: 2, campaign: 'Gaming Setup Review', amount: 'RM250', date: '2024-01-18', status: 'Completed' },
    { id: 3, campaign: 'Fitness App Promotion', amount: 'RM120', date: '2024-01-15', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Talent Dashboard</h1>
        <p className="text-gray-600">Track your jobs and earnings</p>
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

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-64 bg-gradient-to-t from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Earnings chart will be implemented here</p>
        </div>
      </div>

      {/* Active Jobs and Recent Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Jobs</h3>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{job.campaign}</h4>
                  <span className="text-sm font-medium text-green-600">{job.payout}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.brand}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {job.deadline}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'Review Due' ? 'bg-red-100 text-red-800' :
                    job.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
          <div className="space-y-3">
            {recentEarnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{earning.campaign}</p>
                  <p className="text-sm text-gray-600">{earning.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{earning.amount}</p>
                  <p className="text-xs text-gray-500">{earning.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;