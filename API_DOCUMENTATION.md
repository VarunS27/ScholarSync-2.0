# ScholarSync API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📚 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

### 2. Login User
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Get the authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Update Profile *(Frontend Expected)*
**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated"
}
```

---

### 5. Change Password *(Frontend Expected)*
**PUT** `/auth/password`

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📝 Notes Endpoints

### 6. Get All Notes
**GET** `/notes`

Retrieve all notes with optional filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `subject` (string): Filter by subject ID
- `search` (string): Search in title/description
- `tags` (string): Filter by tags (comma-separated)
- `uploader` (string): Filter by uploader user ID

**Example:**
```
GET /notes?page=1&limit=10&subject=subject_id&search=calculus
```

**Response (200 OK):**
```json
{
  "notes": [
    {
      "_id": "note_id",
      "title": "Calculus I - Differentiation",
      "description": "Comprehensive notes on differentiation",
      "subject": {
        "_id": "subject_id",
        "name": "Mathematics"
      },
      "uploaderId": {
        "_id": "user_id",
        "name": "John Doe"
      },
      "fileUrl": "file_url_here",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "tags": ["calculus", "differentiation", "math"],
      "views": 150,
      "likes": ["user_id_1", "user_id_2"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalNotes": 50
}
```

---

### 7. Get Single Note
**GET** `/notes/:id`

Get a specific note by ID. Increments view count.

**Response (200 OK):**
```json
{
  "_id": "note_id",
  "title": "Calculus I - Differentiation",
  "description": "Comprehensive notes on differentiation",
  "subject": {
    "_id": "subject_id",
    "name": "Mathematics"
  },
  "uploaderId": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "fileUrl": "file_url_here",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "tags": ["calculus", "differentiation", "math"],
  "views": 151,
  "likes": ["user_id_1", "user_id_2"],
  "comments": [
    {
      "_id": "comment_id",
      "userId": {
        "_id": "user_id",
        "name": "Jane Smith"
      },
      "text": "Great notes!",
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 8. Upload Note
**POST** `/notes`

Upload a new note with file.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (File): PDF/DOC file to upload
- `title` (string): Note title
- `description` (string): Note description
- `subject` (string): Subject ID
- `tags` (array): Array of tag strings

**Example (using FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('title', 'Calculus I Notes');
formData.append('description', 'Complete notes on differentiation');
formData.append('subject', 'subject_id');
formData.append('tags', JSON.stringify(['calculus', 'math']));
```

**Response (201 Created):**
```json
{
  "message": "Note uploaded successfully",
  "note": {
    "_id": "note_id",
    "title": "Calculus I Notes",
    "description": "Complete notes on differentiation",
    "subject": "subject_id",
    "uploaderId": "user_id",
    "fileUrl": "file_url_here",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "tags": ["calculus", "math"],
    "views": 0,
    "likes": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 9. Delete Note
**DELETE** `/notes/:id`

Delete a note (only by uploader or admin).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Note deleted successfully"
}
```

---

### 10. Like/Unlike Note
**POST** `/notes/:id/like`

Toggle like status on a note.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Note liked successfully",
  "likes": ["user_id_1", "user_id_2", "user_id_3"]
}
```

or

```json
{
  "message": "Note unliked successfully",
  "likes": ["user_id_1", "user_id_2"]
}
```

---

### 11. Download Note
**GET** `/notes/:id/download`

Download the note file.

**Headers:** `Authorization: Bearer <token>`

**Response:** File stream with appropriate headers

---

## 💬 Comments Endpoints

### 12. Add Comment
**POST** `/notes/:id/comments`

Add a comment to a note.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "These notes are really helpful!"
}
```

**Response (201 Created):**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "comment_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "text": "These notes are really helpful!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 13. Delete Comment
**DELETE** `/notes/:noteId/comments/:commentId`

Delete a comment (only by comment author or admin).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}
```

---

## 🎓 Subjects Endpoints

### 14. Get All Subjects
**GET** `/subjects`

Get all available subjects.

**Response (200 OK):**
```json
[
  {
    "_id": "subject_id_1",
    "name": "Computer Science",
    "description": "Programming, algorithms, data structures",
    "icon": "💻"
  },
  {
    "_id": "subject_id_2",
    "name": "Mathematics",
    "description": "Calculus, algebra, statistics",
    "icon": "📐"
  }
]
```

---

### 15. Create Subject
**POST** `/subjects`

Create a new subject (admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Physics",
  "description": "Mechanics, thermodynamics, electromagnetism",
  "icon": "⚛️"
}
```

**Response (201 Created):**
```json
{
  "message": "Subject created successfully",
  "subject": {
    "_id": "subject_id",
    "name": "Physics",
    "description": "Mechanics, thermodynamics, electromagnetism",
    "icon": "⚛️"
  }
}
```

---

## 👨‍💼 Admin Endpoints

### 16. Get Dashboard Stats
**GET** `/admin/stats`

Get admin dashboard statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "totalUsers": 150,
  "totalNotes": 500,
  "totalSubjects": 18,
  "totalViews": 25000,
  "totalLikes": 3500,
  "recentUsers": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "popularNotes": [
    {
      "_id": "note_id",
      "title": "Calculus I Notes",
      "views": 500,
      "likes": 50
    }
  ]
}
```

---

### 17. Get All Users
**GET** `/admin/users`

Get all users (admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200 OK):**
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalUsers": 150
}
```

---

### 18. Delete User
**DELETE** `/admin/users/:id`

Delete a user and all their notes (admin only).

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 19. Toggle Admin Role
**PUT** `/admin/users/:id/role`

Toggle user's admin status.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "role": "admin"
  }
}
```

---

## 📊 Frontend Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Homepage with hero section |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |
| `/notes` | Home | Browse all notes (public) |
| `/notes/:id` | NotePreview | View single note details |

### Protected Routes (Require Authentication)
| Route | Component | Description |
|-------|-----------|-------------|
| `/upload` | Upload | Upload new notes |
| `/profile` | Profile | User profile page with stats |
| `/my-notes` | MyNotes | Manage uploaded notes |
| `/settings` | Settings | Account settings & password |

### Admin Routes (Require Admin Role)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboard | Admin panel with statistics |

---

## 🔐 Demo Credentials

**Regular User:**
```
Email: demo@scholarsync.com
Password: demo123
```

**Database:**
- **18 Subjects** available
- **15 Sample Notes** created
- **Demo User** configured

---

## 📦 Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## 🛡️ Error Response Format

```json
{
  "message": "Error description here",
  "error": "Detailed error information (development only)"
}
```

---

## 📝 Notes on File Storage

- Files are stored in **MongoDB GridFS**
- Supported formats: **PDF, DOC, DOCX, PPT, PPTX**
- Maximum file size: **50MB**
- Files are served via streaming for efficiency
- Download URLs expire based on authentication

---

## 🚀 Quick Start Example

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});
const { token } = await registerResponse.json();

// 2. Get Notes
const notesResponse = await fetch('http://localhost:5000/api/notes', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const notes = await notesResponse.json();

// 3. Upload Note
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My Notes');
formData.append('subject', 'subject_id');

const uploadResponse = await fetch('http://localhost:5000/api/notes', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## 📞 Support

For issues or questions, please create an issue in the repository.

**Happy Coding! 🎓📚**
