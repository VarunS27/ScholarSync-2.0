const { body, validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const Note = require('../models/Note');

// Validation rules
const subjectValidation = [
  body('name').trim().notEmpty().withMessage('Subject name is required')
];

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    // Get note count for each subject
    const subjectsWithCount = await Promise.all(
      subjects.map(async (subject) => {
        const count = await Note.countDocuments({ subject: subject.name });
        return {
          _id: subject._id,
          name: subject.name,
          noteCount: count,
          createdAt: subject.createdAt
        };
      })
    );

    res.json({ subjects: subjectsWithCount });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};

// Add subject (admin only)
const addSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const subject = new Subject({ name });
    await subject.save();

    res.status(201).json({
      message: 'Subject added successfully',
      subject
    });
  } catch (error) {
    console.error('Add subject error:', error);
    res.status(500).json({ message: 'Failed to add subject' });
  }
};

// Delete subject (admin only)
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if subject has notes
    const noteCount = await Note.countDocuments({ subject: subject.name });
    if (noteCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete subject. ${noteCount} note(s) are associated with this subject.` 
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Failed to delete subject' });
  }
};

module.exports = {
  getSubjects,
  addSubject,
  deleteSubject,
  subjectValidation
};
