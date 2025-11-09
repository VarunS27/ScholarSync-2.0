const express = require('express');
const router = express.Router();
const { streamFileFromGridFS, getFileInfo } = require('../utils/s3Uploader');

/**
 * @route   GET /api/files/:fileId
 * @desc    Stream file from GridFS
 * @access  Public
 */
router.get('/:fileId', async (req, res) => {
  try {
    const fileInfo = await getFileInfo(req.params.fileId);
    
    if (!fileInfo) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers
    res.set({
      'Content-Type': fileInfo.contentType,
      'Content-Disposition': `inline; filename="${fileInfo.metadata?.originalName || fileInfo.filename}"`,
    });

    // Stream the file
    const downloadStream = streamFileFromGridFS(req.params.fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({ message: 'Error streaming file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
