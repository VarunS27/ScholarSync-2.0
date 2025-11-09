import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { notesAPI } from '../utils/api';
import { toast } from 'react-toastify';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    tags: '',
    allowDownload: true,
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch subjects
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const result = await notesAPI.getSubjects();
      console.log('📚 Subjects received:', result.data);
      return result.data; // Return the data, not the whole axios response
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data) => notesAPI.uploadNote(data),
    onSuccess: () => {
      toast.success('Note uploaded successfully! 🎉');
      navigate('/notes');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    },
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or images.');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subject', formData.subject);
    data.append('allowDownload', formData.allowDownload);
    
    if (formData.tags) {
      data.append('tags', formData.tags);
    }

    uploadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
            Upload{' '}
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Notes
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your knowledge and help fellow students succeed
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700"
        >
          {/* Drag & Drop Zone */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              Upload File
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50'
              }`}
            >
              {file ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center space-x-4"
                >
                  <div className="flex items-center space-x-3 bg-green-100 dark:bg-green-900/30 px-6 py-4 rounded-xl">
                    <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FiUpload className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Drag & drop your file here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    or click to browse from your computer
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Choose File
                  </label>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Data Structures - Sorting Algorithms"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Brief description of what this note covers..."
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select a subject</option>
                {subjectsData?.subjects?.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="algorithms, trees, complexity"
              />
            </div>

            {/* Allow Download */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowDownload"
                name="allowDownload"
                checked={formData.allowDownload}
                onChange={(e) => setFormData({ ...formData, allowDownload: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowDownload" className="text-gray-700 dark:text-gray-300 font-medium">
                Allow others to download this file
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="flex-1 group relative px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <FiUpload className="w-5 h-5" />
                <span>{uploadMutation.isPending ? 'Uploading...' : 'Upload Note'}</span>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Upload;
