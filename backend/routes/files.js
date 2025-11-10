const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Stream file for preview (inline)
router.get('/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    console.log('📥 File preview request:', fileId);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      console.log('❌ Invalid file ID format');
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Get file metadata
    const files = await mongoose.connection.db
      .collection('uploads.files')
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!files || files.length === 0) {
      console.log('❌ File not found in GridFS');
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    console.log('✅ File found:', { filename: file.filename, contentType: file.contentType, size: file.length });

    // Set headers for inline preview
    res.set({
      'Content-Type': file.contentType || 'application/pdf',
      'Content-Length': file.length,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    });

    // Stream file
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on('data', (chunk) => {
      console.log(`📦 Streaming chunk: ${chunk.length} bytes`);
    });

    downloadStream.on('error', (error) => {
      console.error('❌ Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error streaming file' });
      }
    });

    downloadStream.on('end', () => {
      console.log('✅ File stream completed');
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Get file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download file (force download)
router.get('/:id/download', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    console.log('⬇️ File download request:', fileId);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Get file metadata
    const files = await mongoose.connection.db
      .collection('uploads.files')
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!files || files.length === 0) {
      console.log('❌ File not found for download');
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    console.log('✅ Downloading file:', file.filename);

    // Set headers for download
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': file.length,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Accept-Ranges': 'bytes'
    });

    // Stream file
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on('error', (error) => {
      console.error('❌ Download stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error downloading file' });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Download file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
