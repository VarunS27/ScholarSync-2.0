# ScholarSync - Full Stack Note Sharing Platform

<div align="center">

![ScholarSync](https://img.shields.io/badge/ScholarSync-Share.Learn.Excel-2563eb?style=for-the-badge)

A responsive, secure note-sharing platform for students with AWS S3 storage, admin controls, and real-time interactions.

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-aws)](https://aws.amazon.com/s3/)

</div>

## 🌟 Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based auth with refresh tokens
- 📤 **File Upload** - Support for PDF, DOCX, PPTX, images, and text files
- 👁️ **Preview System** - In-browser preview with optional downloads
- 👍 **Reactions** - Like/dislike system with real-time updates
- 💬 **Comments** - Engage with content creators
- 🔍 **Smart Search** - Search by title, subject, tags with autocomplete
- 📊 **Admin Dashboard** - Analytics, user management, content moderation
- 🎨 **Dark/Light Theme** - Smooth theme switching with Framer Motion
- 📱 **Fully Responsive** - Mobile-first design

### Security
- 🔒 Password hashing with bcrypt
- 🎫 JWT access & refresh tokens
- 🛡️ Rate limiting on sensitive routes
- 🚫 Ban/unban users (admin)
- 🚩 Report inappropriate content

### File Management
- ☁️ AWS S3 storage with signed URLs
- 🔐 Secure upload/download
- 📏 50MB file size limit
- 🎯 Multiple file format support

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **File Storage:** AWS S3 SDK v3
- **File Upload:** Multer
- **Security:** Helmet, CORS, rate-limiting
- **Validation:** express-validator

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- AWS Account with S3 bucket
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/scholarsync.git
cd scholarsync
```

### 2️⃣ Backend Setup

```bash
cd backend
```

#### Install Dependencies
```bash
npm install express mongoose dotenv bcrypt jsonwebtoken cors helmet express-rate-limit express-validator multer @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Configure Environment Variables
Create `.env` file in `backend/` directory:

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scholarsync?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=scholarsync-notes
```

#### Start Backend Server
```bash
npm start
```
Server runs on `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install react-router-dom axios @tanstack/react-query react-icons framer-motion recharts react-toastify
npm install -D tailwindcss postcss autoprefixer
```

#### Configure Environment Variables
Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🗂️ Project Structure

```
scholarsync/
├── backend/
│   ├── controllers/       # Route logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, admin, error handlers
│   ├── utils/            # S3 uploader, helpers
│   ├── server.js         # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth & Theme contexts
│   │   ├── utils/        # API client, helpers
│   │   ├── App.jsx       # Main app with routing
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── public/
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user
- `GET /me` - Get current user

### Notes (`/api/notes`)
- `POST /` - Upload note (protected)
- `GET /` - Get all notes with filters
- `GET /:id` - Get single note
- `PUT /:id` - Update note (owner/admin)
- `DELETE /:id` - Delete note (owner/admin)
- `GET /download/:id` - Get download URL
- `GET /user/my-notes` - Get user's notes

### Comments (`/api/comments`)
- `POST /:noteId` - Add comment (protected)
- `GET /:noteId` - Get comments for note
- `DELETE /:id` - Delete comment (owner/admin)

### Reactions (`/api/reactions`)
- `POST /like/:noteId` - Toggle like (protected)
- `POST /dislike/:noteId` - Toggle dislike (protected)
- `GET /status/:noteId` - Get reaction status

### Reports (`/api/reports`)
- `POST /note/:id` - Report note (protected)
- `GET /` - Get all reports (admin)
- `PUT /resolve/:id` - Resolve report (admin)

### Subjects (`/api/subjects`)
- `GET /` - Get all subjects
- `POST /` - Add subject (admin)
- `DELETE /:id` - Delete subject (admin)

### Search (`/api/search`)
- `GET /?q=query` - Search notes
- `GET /suggest?q=query` - Get search suggestions

### Admin (`/api/admin`)
- `GET /stats` - Dashboard statistics
- `GET /users` - Get all users
- `PUT /ban/:userId` - Ban/unban user
- `DELETE /user/:userId` - Delete user
- `GET /reported` - Get reported notes

---

## 🎨 Color Scheme

```css
Primary: #2563eb (Blue)
Accent: #fbbf24 (Amber)
Background Light: #f9fafb
Background Dark: #111827
Text Light: #111827
Text Dark: #f9fafb
```

---

## 🔐 AWS S3 Setup

### 1. Create S3 Bucket
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Name: `scholarsync-notes`
4. Region: `ap-south-1` (or your preferred)
5. **Uncheck** "Block all public access" (we use signed URLs)
6. Create bucket

### 2. Configure CORS
Add CORS policy to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

### 3. Create IAM User
1. Go to IAM Console
2. Create user with programmatic access
3. Attach policy: `AmazonS3FullAccess` (or custom policy)
4. Save Access Key ID and Secret Access Key

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create Render Account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect GitHub repository
   - Root directory: `backend`
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add Environment Variables**
   - Add all variables from `.env`
   - Update `FRONTEND_URL` to your Vercel URL

### Frontend Deployment (Vercel)

1. **Create Vercel Account** at [vercel.com](https://vercel.com)

2. **Import Project**
   - Connect GitHub repository
   - Root directory: `frontend`
   - Framework: Vite

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.render.com/api
   ```

4. **Deploy**
   - Vercel auto-deploys on git push

---

## 👨‍💻 Usage

### For Students

1. **Register/Login** - Create an account
2. **Browse Notes** - Explore notes by subject
3. **Upload Notes** - Share your study materials
4. **Engage** - Like, comment, download helpful resources
5. **Manage** - Edit or delete your uploads

### For Admins

1. **Dashboard** - View analytics and statistics
2. **User Management** - Ban/unban users
3. **Content Moderation** - Review reported notes
4. **Subject Management** - Add/remove subjects

---

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (dev mode)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📸 Screenshots

### Landing Page
Modern, responsive landing page with feature highlights

### Note Preview
Full-screen preview with PDF/document viewer

### Admin Dashboard
Comprehensive analytics with charts and graphs

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🐛 Known Issues & Troubleshooting

### Issue: CORS Errors
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: S3 Upload Fails
**Solution:** Check AWS credentials and bucket permissions

### Issue: MongoDB Connection Error
**Solution:** Verify `MONGO_URI` and whitelist your IP in MongoDB Atlas

### Issue: JWT Token Expired
**Solution:** Tokens auto-refresh. Clear localStorage and re-login if issues persist

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@scholarsync.com

---

## 🙏 Acknowledgments

- React & Vite teams
- Tailwind CSS
- MongoDB
- AWS
- All open-source contributors

---

<div align="center">

**Built with ❤️ by ScholarSync Team**

[Website](https://scholarsync.com) • [Documentation](https://docs.scholarsync.com) • [Report Bug](https://github.com/issues)

</div>
