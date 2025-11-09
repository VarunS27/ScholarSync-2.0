require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const subjectsRoutes = require('./routes/subjects');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const filesRoutes = require('./routes/files');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', filesRoutes);

app.get('/api/health', (req, res) => { res.json({ status: 'ok', message: 'ScholarSync API is running' }); });
app.use((req, res) => { res.status(404).json({ message: 'Route not found' }); });
app.use(errorHandler);

const connectDB = async () => { try { await mongoose.connect(process.env.MONGO_URI); console.log(' MongoDB connected successfully'); const { initGridFS } = require('./utils/s3Uploader'); initGridFS(); console.log(' GridFS initialized successfully'); } catch (error) { console.error(' MongoDB connection error:', error); process.exit(1); } };

const PORT = process.env.PORT || 5000;
connectDB().then(() => { app.listen(PORT, () => { console.log(' Server running on port ' + PORT); console.log(' Environment: ' + (process.env.NODE_ENV || 'development')); }); });
process.on('unhandledRejection', (err) => { console.error('Unhandled Rejection:', err); process.exit(1); });
