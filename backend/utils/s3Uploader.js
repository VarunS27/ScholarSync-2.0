const mongoose = require('mongoose');

// GridFS initialization (only)
let gridfsBucket;

const initGridFS = () => {
  const conn = mongoose.connection;
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  console.log('✅ GridFS initialized for file storage');
};

module.exports = {
  initGridFS,
  gridfsBucket
};
