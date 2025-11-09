const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

// Initialize GridFS bucket
const initGridFS = () => {
  if (!bucket) {
    const db = mongoose.connection.db;
    bucket = new GridFSBucket(db, {
      bucketName: 'uploads'
    });
  }
  return bucket;
};

/**
 * Upload file to MongoDB GridFS
 */
const uploadToS3 = async (file, folder = 'notes') => {
  try {
    const gridFSBucket = initGridFS();
    const filename = `${folder}-${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    return new Promise((resolve, reject) => {
      const uploadStream = gridFSBucket.openUploadStream(filename, {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          folder: folder
        }
      });

      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        reject(new Error('Failed to upload file'));
      });

      uploadStream.on('finish', () => {
        resolve({
          fileKey: uploadStream.id.toString(),
          fileUrl: `/api/files/${uploadStream.id.toString()}`,
        });
      });

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from GridFS
 */
const deleteFromS3 = async (fileKey) => {
  try {
    const gridFSBucket = initGridFS();
    await gridFSBucket.delete(new mongoose.Types.ObjectId(fileKey));
    return true;
  } catch (error) {
    console.error('GridFS delete error:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Get file stream from GridFS
 */
const getSignedUrlForFile = async (fileKey, expiresIn = 3600) => {
  try {
    // For GridFS, we return the API endpoint URL
    // The actual file streaming will be handled by a route
    return `/api/files/${fileKey}`;
  } catch (error) {
    console.error('Get file error:', error);
    throw new Error('Failed to get file URL');
  }
};

/**
 * Stream file from GridFS
 */
const streamFileFromGridFS = (fileKey) => {
  const gridFSBucket = initGridFS();
  return gridFSBucket.openDownloadStream(new mongoose.Types.ObjectId(fileKey));
};

/**
 * Get file info from GridFS
 */
const getFileInfo = async (fileKey) => {
  try {
    const gridFSBucket = initGridFS();
    const files = await gridFSBucket.find({ _id: new mongoose.Types.ObjectId(fileKey) }).toArray();
    return files[0] || null;
  } catch (error) {
    console.error('Get file info error:', error);
    return null;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  getSignedUrlForFile,
  streamFileFromGridFS,
  getFileInfo,
  initGridFS,
};
