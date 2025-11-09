import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiSearch, FiTrendingUp, FiClock, FiHeart, FiX } from 'react-icons/fi';
import { notesAPI } from '../utils/api';
import NoteCard from '../components/NoteCard';
import Loader from '../components/Loader';

const Home = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'mostLiked'
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notes
  const { data: notesData, isLoading: notesLoading, error: notesError } = useQuery({
    queryKey: ['notes', searchTerm, selectedSubject, sortBy],
    queryFn: async () => {
      console.log('🔍 Fetching notes with params:', { search: searchTerm, subject: selectedSubject });
      const result = await notesAPI.getAllNotes({ search: searchTerm, subject: selectedSubject });
      console.log('✅ Notes data received:', result.data);
      return result.data; // Return the data, not the whole axios response
    },
  });

  // Log for debugging
  React.useEffect(() => {
    console.log('📊 Home component state:', {
      notesData,
      notesLoading,
      notesError,
      notesCount: notesData?.notes?.length
    });
  }, [notesData, notesLoading, notesError]);

  // Fetch subjects for filter
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const result = await notesAPI.getSubjects();
      return result.data; // Return the data, not the whole axios response
    },
  });

  const sortedNotes = React.useMemo(() => {
    console.log('🔄 Sorting notes, input:', notesData?.notes);
    if (!notesData?.notes) return [];
    let sorted = [...notesData.notes];
    
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'mostLiked':
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case 'latest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [notesData, sortBy]);

  const filteredNotes = searchTerm
    ? sortedNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedNotes;

  console.log('📋 Final filtered notes:', filteredNotes);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Discover{' '}
              <span className="bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Notes
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse thousands of high-quality notes shared by students worldwide
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes, topics, keywords..."
                className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
              />
              <FiSearch className="absolute left-4 top-5 text-gray-400 w-5 h-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Sort Dropdown */}
              <div className="flex-1 lg:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-lg transition-all"
                >
                  <option value="latest">Latest First</option>
                  <option value="popular">Most Viewed</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  showFilters
                    ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <FiFilter className="w-5 h-5" />
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'list'
                      ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filter by Subject</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubject('')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      selectedSubject === ''
                        ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All Subjects
                  </button>
                  {subjectsData?.subjects?.map((subject) => (
                    <button
                      key={subject._id}
                      onClick={() => setSelectedSubject(subject._id)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        selectedSubject === subject._id
                          ? 'bg-linear-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FiTrendingUp />, label: 'Total Notes', value: filteredNotes.length },
            { icon: <FiClock />, label: 'Recently Added', value: filteredNotes.filter(n => new Date(n.createdAt) > Date.now() - 7 * 24 * 60 * 60 * 1000).length },
            { icon: <FiHeart />, label: 'Popular', value: filteredNotes.filter(n => (n.likes?.length || 0) > 10).length },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notes Grid/List */}
        {notesLoading ? (
          <Loader />
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-5xl mx-auto mb-6 shadow-2xl">
              📚
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No notes found</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedSubject(''); }}
              className="px-8 py-4 bg-linear-to-br from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'flex flex-col gap-6'
          }>
            {filteredNotes.map((note, index) => (
              <NoteCard key={note._id} note={note} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
