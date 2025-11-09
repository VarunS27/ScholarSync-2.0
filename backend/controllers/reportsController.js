const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Note = require('../models/Note');

// Validation rules
const reportValidation = [
  body('reason').trim().notEmpty().withMessage('Reason is required').isLength({ max: 500 })
];

// Report a note
const reportNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { reason } = req.body;

    // Check if note exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user already reported this note
    const existingReport = await Report.findOne({
      noteId: id,
      reporterId: req.user._id,
      resolved: false
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this note' });
    }

    const report = new Report({
      noteId: id,
      reporterId: req.user._id,
      reason
    });

    await report.save();

    res.status(201).json({
      message: 'Note reported successfully',
      report
    });
  } catch (error) {
    console.error('Report note error:', error);
    res.status(500).json({ message: 'Failed to report note' });
  }
};

// Get all reports (admin only)
const getReports = async (req, res) => {
  try {
    const { resolved = 'false' } = req.query;

    const filter = {};
    if (resolved !== 'all') {
      filter.resolved = resolved === 'true';
    }

    const reports = await Report.find(filter)
      .populate('noteId', 'title subject uploaderId')
      .populate('reporterId', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      reports,
      total: reports.length
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// Resolve report (admin only)
const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.resolved = true;
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();

    await report.save();

    res.json({
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ message: 'Failed to resolve report' });
  }
};

// Get report count for a note
const getNoteReportCount = async (req, res) => {
  try {
    const count = await Report.countDocuments({
      noteId: req.params.noteId,
      resolved: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get note report count error:', error);
    res.status(500).json({ message: 'Failed to fetch report count' });
  }
};

module.exports = {
  reportNote,
  getReports,
  resolveReport,
  getNoteReportCount,
  reportValidation
};
