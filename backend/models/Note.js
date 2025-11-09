const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  allowDownload: {
    type: Boolean,
    default: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileKey: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
noteSchema.index({ subject: 1, createdAt: -1 });
noteSchema.index({ uploaderId: 1 });
noteSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for like count
noteSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
noteSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Ensure virtuals are included in JSON
noteSchema.set('toJSON', { virtuals: true });
noteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Note', noteSchema);
