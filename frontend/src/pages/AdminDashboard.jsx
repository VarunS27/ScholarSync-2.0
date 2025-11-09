import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiAlertTriangle, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen />;

  const COLORS = ['#2563eb', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link to="/admin/users" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
              Manage Users
            </Link>
            <Link to="/admin/reported" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reported Content
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <FiUsers />, label: 'Total Users', value: stats?.stats?.totalUsers, color: 'bg-blue-500' },
            { icon: <FiFileText />, label: 'Total Notes', value: stats?.stats?.totalNotes, color: 'bg-green-500' },
            { icon: <FiAlertTriangle />, label: 'Reports', value: stats?.stats?.totalReports, color: 'bg-red-500' },
            { icon: <FiTrendingUp />, label: 'Total Views', value: stats?.stats?.totalViews, color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value || 0}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Notes by Subject */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notes by Subject</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.notesBySubject || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most Liked Subjects */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Most Liked Subjects</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.mostLikedSubjects || []}
                  dataKey="totalLikes"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats?.mostLikedSubjects?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Uploads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Uploads (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.dailyUploads || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Uploads & Top Uploaders */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Uploads */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Uploads</h2>
            <div className="space-y-3">
              {stats?.recentUploads?.map((note) => (
                <Link
                  key={note._id}
                  to={`/notes/${note._id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{note.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {note.subject} • {note.uploaderId?.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Uploaders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Uploaders</h2>
            <div className="space-y-3">
              {stats?.topUploaders?.map((uploader, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-accent text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{uploader.user?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{uploader.user?.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {uploader.uploadCount} notes
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
