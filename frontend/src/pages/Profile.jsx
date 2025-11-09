import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiFileText, FiHeart, FiEye, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI, notesAPI } from '../utils/api';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  // Fetch user's notes
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['my-notes'],
    queryFn: () => notesAPI.getAllNotes({ uploader: user?._id }),
    enabled: !!user,
  });

  const myNotes = notesData?.notes || [];
  const totalViews = myNotes.reduce((sum, note) => sum + (note.views || 0), 0);
  const totalLikes = myNotes.reduce((sum, note) => sum + (note.likes?.length || 0), 0);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-light dark:bg-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.name}
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <FiMail className="w-5 h-5" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-5 h-5" />
                  <span>Joined {user?.createdAt && format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="mt-3 inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg font-semibold">
                  <FiAward className="w-5 h-5 mr-2" />
                  Administrator
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <FiFileText />, label: 'Notes Uploaded', value: myNotes.length, color: 'bg-primary' },
            { icon: <FiEye />, label: 'Total Views', value: totalViews, color: 'bg-secondary' },
            { icon: <FiHeart />, label: 'Total Likes', value: totalLikes, color: 'bg-red-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Recent Notes</h2>
            <Link
              to="/my-notes"
              className="text-primary hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>

          {myNotes.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start sharing your knowledge with the community!
              </p>
              <Link
                to="/upload"
                className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Upload Your First Note
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myNotes.slice(0, 5).map((note) => (
                <Link
                  key={note._id}
                  to={`/notes/${note._id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {note.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <FiEye className="w-4 h-4" />
                          <span>{note.views || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FiHeart className="w-4 h-4" />
                          <span>{note.likes?.length || 0}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {note.createdAt && format(new Date(note.createdAt), 'MMM d')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
