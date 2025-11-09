import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiFileText, FiEye, FiHeart, FiEdit2, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../utils/api';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  // Fetch user's notes
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['my-notes'],
    queryFn: () => notesAPI.getAllNotes({ uploader: user?._id }),
    enabled: !!user,
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (noteId) => notesAPI.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-notes']);
      toast.success('Note deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  const myNotes = notesData?.notes || [];

  // Filter notes
  const filteredNotes = myNotes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || note.subject?.name === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects
  const subjects = [...new Set(myNotes.map(note => note.subject?.name).filter(Boolean))];

  const handleDelete = (noteId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(noteId);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-light dark:bg-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your uploaded notes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Notes', value: myNotes.length, icon: <FiFileText />, color: 'bg-primary' },
            { label: 'Total Views', value: myNotes.reduce((sum, n) => sum + (n.views || 0), 0), icon: <FiEye />, color: 'bg-secondary' },
            { label: 'Total Likes', value: myNotes.reduce((sum, n) => sum + (n.likes?.length || 0), 0), icon: <FiHeart />, color: 'bg-red-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
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

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredNotes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {myNotes.length === 0 ? 'No notes uploaded yet' : 'No notes found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {myNotes.length === 0 
                  ? 'Start sharing your knowledge with the community!' 
                  : 'Try adjusting your search or filters'}
              </p>
              {myNotes.length === 0 && (
                <Link
                  to="/upload"
                  className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                >
                  Upload Your First Note
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note, idx) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                    
                    {/* Note Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/notes/${note._id}`}
                        className="group"
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                          {note.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {note.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {note.subject && (
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                            {note.subject.name}
                          </span>
                        )}
                        {note.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-2">
                          <FiEye className="w-4 h-4" />
                          <span>{note.views || 0} views</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <FiHeart className="w-4 h-4" />
                          <span>{note.likes?.length || 0} likes</span>
                        </span>
                        <span className="text-gray-400">
                          {note.createdAt && format(new Date(note.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center gap-2">
                      <Link
                        to={`/notes/${note._id}`}
                        className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-teal-600 transition-all flex items-center space-x-2"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(note._id, note.title)}
                        disabled={deleteMutation.isLoading}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center space-x-2 disabled:opacity-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyNotes;
