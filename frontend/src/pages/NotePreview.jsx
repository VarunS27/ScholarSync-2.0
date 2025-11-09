import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiHeart, FiDownload, FiEye, FiMessageCircle, FiShare2, 
  FiUser, FiClock, FiTag, FiAlertCircle, FiThumbsDown 
} from 'react-icons/fi';
import { format } from 'date-fns';
import { notesAPI, reactionsAPI, commentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const NotePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  // Fetch note details
  const { data: noteData, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      // Check if this note has been viewed in this session
      const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
      const hasViewed = viewedNotes.includes(id);
      
      // Only increment view on first visit
      const incrementView = !hasViewed;
      
      const result = await notesAPI.getNoteById(id, { incrementView });
      console.log('📝 Note data received:', result.data);
      
      // Mark as viewed
      if (!hasViewed) {
        viewedNotes.push(id);
        localStorage.setItem('viewedNotes', JSON.stringify(viewedNotes));
      }
      
      return result.data;
    },
  });

  const note = noteData?.note;
  const previewUrl = noteData?.previewUrl;

  // Fetch reaction status
  const { data: reactionData } = useQuery({
    queryKey: ['reactions', id],
    queryFn: async () => {
      if (!user) return null;
      const result = await reactionsAPI.getReactionStatus(id);
      return result.data;
    },
    enabled: !!user,
  });

  // Fetch comments
  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const result = await commentsAPI.getComments(id);
      return result.data;
    },
  });

  const comments = commentsData?.comments || [];

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => reactionsAPI.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['note', id]);
      queryClient.invalidateQueries(['reactions', id]);
      toast.success('Reaction updated! 👍');
    },
  });

  // Dislike mutation
  const dislikeMutation = useMutation({
    mutationFn: () => reactionsAPI.toggleDislike(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['note', id]);
      queryClient.invalidateQueries(['reactions', id]);
      toast.success('Reaction updated! 👎');
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (text) => commentsAPI.addComment(id, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
      setComment('');
      toast.success('Comment added! 💬');
    },
  });

  const handleDownload = async () => {
    try {
      // Get the signed download URL from backend
      const response = await notesAPI.getDownloadUrl(id);
      const { downloadUrl, filename } = response.data;
      
      // Open the signed URL in a new tab to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename || note.title);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Download started! 📥');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Download failed');
    }
  };

  if (isLoading) return <Loader />;
  if (!note) return <div className="min-h-screen flex items-center justify-center"><p>Note not found</p></div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold mb-3">
                    {note.subject || 'General'}
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                    {note.title}
                  </h1>
                  {note.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {note.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <FiEye className="w-5 h-5" />
                      <span className="font-semibold">{note.views || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiHeart className="w-5 h-5" />
                      <span className="font-semibold">{reactionData?.likes || note.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiMessageCircle className="w-5 h-5" />
                      <span className="font-semibold">{comments.length} comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => likeMutation.mutate()}
                  disabled={!user}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    reactionData?.userLiked
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${reactionData?.userLiked ? 'fill-current' : ''}`} />
                  <span>{reactionData?.likes || note.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => dislikeMutation.mutate()}
                  disabled={!user}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    reactionData?.userDisliked
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiThumbsDown className={`w-5 h-5 ${reactionData?.userDisliked ? 'fill-current' : ''}`} />
                  <span>{reactionData?.dislikes || note.dislikes?.length || 0}</span>
                </button>

                {note.allowDownload && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <FiDownload className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                )}

                <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <FiShare2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>

            {/* Document Viewer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Document Preview</h3>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden" style={{ minHeight: '600px' }}>
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    style={{ minHeight: '600px' }}
                    title="Document Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ minHeight: '600px' }}>
                    <p className="text-gray-500 dark:text-gray-400">Preview not available</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              {user ? (
                <div className="mb-8">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={() => comment.trim() && commentMutation.mutate(comment)}
                    disabled={!comment.trim() || commentMutation.isPending}
                    className="mt-3 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-blue-900 dark:text-blue-300">
                    Please <Link to="/login" className="font-bold underline">login</Link> to comment
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c._id} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                        {c.userId?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-gray-900 dark:text-white">{c.userId?.name || 'Anonymous'}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {c.createdAt && format(new Date(c.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Uploaded By</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {note.uploaderId?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{note.uploaderId?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {note.createdAt && format(new Date(note.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* File Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">File Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{note.fileType || 'PDF'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Size</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Downloads</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {note.allowDownload ? 'Allowed ✅' : 'Not Allowed ❌'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
