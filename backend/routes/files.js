const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get file stream from GridFS
router.get('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    // Find file info
    const files = await db.collection('uploads.files').find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    
    // Set headers for browser preview
    res.set({
      'Content-Type': file.contentType || 'application/pdf',
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'public, max-age=3600',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({ message: 'Error streaming file' });
    });

    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
