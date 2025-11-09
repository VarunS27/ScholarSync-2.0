import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiDownload, FiFileText, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const NoteCard = ({ note, index = 0 }) => {
  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('word')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <Link to={`/notes/${note._id}`} className="block">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header with gradient */}
          <div className="relative h-32 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 opacity-50">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
              {getFileIcon(note.fileType)} {formatFileSize(note.fileSize)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Subject Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold mb-3">
              {note.subject?.name || 'General'}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {note.title}
            </h3>

            {/* Description */}
            {note.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {note.description}
              </p>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                    +{note.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1" title="Likes">
                  <FiHeart className={`w-4 h-4 ${note.likes?.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="font-semibold">{note.likes?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-1" title="Views">
                  <FiEye className="w-4 h-4" />
                  <span className="font-semibold">{note.views || 0}</span>
                </div>
                {note.allowDownload && (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400" title="Downloadable">
                    <FiDownload className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {note.uploader?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {note.uploader?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                    <FiClock className="w-3 h-3" />
                    <span>{note.createdAt ? format(new Date(note.createdAt), 'MMM d, yyyy') : 'Recently'}</span>
                  </p>
                </div>
              </div>

              {/* View Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-4 py-2 bg-linear-to-br from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg">
                  View
                </div>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 rounded-2xl transition-all pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

export default NoteCard;
