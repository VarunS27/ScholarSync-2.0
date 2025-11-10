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

// Helmet with relaxed COOP for Google OAuth and file previews
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false // Allow embedding PDFs and files
}));

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://scholarsync1.netlify.app',
  'https://scholarsync-2-0.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS - Origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', filesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => { 
  res.json({ 
    status: 'ok', 
    message: 'ScholarSync API is running',
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  }); 
});

// 404 handler with better logging
app.use((req, res) => { 
  console.log('❌ 404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found', path: req.path }); 
});

// Error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => { 
  try { 
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('✅ MongoDB connected successfully'); 
    const { initGridFS } = require('./utils/s3Uploader'); 
    initGridFS(); 
    console.log('✅ GridFS initialized successfully'); 
  } catch (error) { 
    console.error('❌ MongoDB connection error:', error); 
    process.exit(1); 
  } 
};

const PORT = process.env.PORT || 5000;
connectDB().then(() => { 
  app.listen(PORT, () => { 
    console.log(`🚀 Server running on port ${PORT}`); 
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`); 
    console.log(`🌐 Allowed origins:`, allowedOrigins);
  }); 
});

process.on('unhandledRejection', (err) => { 
  console.error('❌ Unhandled Rejection:', err); 
  process.exit(1); 
});
