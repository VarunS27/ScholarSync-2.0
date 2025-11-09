const User = require('../models/User');
const Note = require('../models/Note');
const Report = require('../models/Report');
const Comment = require('../models/Comment');

// Get dashboard stats
const getStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalNotes = await Note.countDocuments();
    const totalReports = await Report.countDocuments({ resolved: false });
    const totalComments = await Comment.countDocuments();

    // Total likes and views
    const notesWithStats = await Note.find();
    const totalLikes = notesWithStats.reduce((sum, note) => sum + note.likes.length, 0);
    const totalViews = notesWithStats.reduce((sum, note) => sum + note.views, 0);

    // Notes per subject
    const notesBySubject = await Note.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Most liked subjects
    const mostLikedSubjects = await Note.aggregate([
      {
        $group: {
          _id: '$subject',
          totalLikes: { $sum: { $size: '$likes' } }
        }
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 5 }
    ]);

    // Daily uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyUploads = await Note.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Recent uploads
    const recentUploads = await Note.find()
      .populate('uploaderId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title subject createdAt uploaderId');

    // Top uploaders
    const topUploaders = await Note.aggregate([
      {
        $group: {
          _id: '$uploaderId',
          uploadCount: { $sum: 1 }
        }
      },
      { $sort: { uploadCount: -1 } },
      { $limit: 5 }
    ]);

    const topUploadersWithDetails = await User.populate(topUploaders, {
      path: '_id',
      select: 'name email'
    });

    res.json({
      stats: {
        totalUsers,
        totalNotes,
        totalReports,
        totalComments,
        totalLikes,
        totalViews
      },
      notesBySubject,
      mostLikedSubjects,
      dailyUploads,
      recentUploads,
      topUploaders: topUploadersWithDetails.map(u => ({
        user: u._id,
        uploadCount: u.uploadCount
      }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const filter = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-passwordHash -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get upload count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const uploadCount = await Note.countDocuments({ uploaderId: user._id });
        return {
          ...user.toObject(),
          uploadCount
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      users: usersWithStats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Ban/unban user
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.error('Toggle ban user error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Get reported notes
const getReportedNotes = async (req, res) => {
  try {
    const reports = await Report.find({ resolved: false })
      .populate({
        path: 'noteId',
        populate: {
          path: 'uploaderId',
          select: 'name email'
        }
      })
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });

    // Group reports by noteId
    const reportsByNote = {};
    
    reports.forEach(report => {
      if (report.noteId) {
        const noteId = report.noteId._id.toString();
        if (!reportsByNote[noteId]) {
          reportsByNote[noteId] = {
            note: report.noteId,
            reports: [],
            reportCount: 0
          };
        }
        reportsByNote[noteId].reports.push({
          id: report._id,
          reporter: report.reporterId,
          reason: report.reason,
          createdAt: report.createdAt
        });
        reportsByNote[noteId].reportCount++;
      }
    });

    const reportedNotes = Object.values(reportsByNote);

    res.json({ reportedNotes });
  } catch (error) {
    console.error('Get reported notes error:', error);
    res.status(500).json({ message: 'Failed to fetch reported notes' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's notes and related data
    await Note.deleteMany({ uploaderId: user._id });
    await Comment.deleteMany({ userId: user._id });
    await Report.deleteMany({ reporterId: user._id });

    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleBanUser,
  getReportedNotes,
  deleteUser
};
