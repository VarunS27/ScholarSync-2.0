# Google OAuth Setup Guide for ScholarSync

## Overview
This guide will help you complete the Google OAuth integration that has been implemented in your application. The code is already in place - you just need to obtain Google credentials and configure them.

## What's Already Implemented

### Backend (✅ Complete)
- `google-auth-library` package installed
- OAuth2Client configured in `backend/controllers/authController.js`
- `googleLogin` controller function that:
  - Verifies Google tokens
  - Creates new users or links existing accounts
  - Generates JWT access/refresh tokens
  - Returns user data with profile picture
- POST `/auth/google` route added
- User model extended with:
  - `googleId` (String, unique, sparse)
  - `profilePicture` (String)
  - `isEmailVerified` (Boolean)

### Frontend (✅ Complete)
- `@react-oauth/google` package installed
- `GoogleOAuthProvider` wrapping entire app
- `GoogleLogin` component integrated in Login page
- `googleLogin` function in AuthContext
- API method for Google authentication
- Success/error handlers with toast notifications

## Step-by-Step Setup

### Step 1: Get Google Client ID

1. **Go to Google Cloud Console**
   - Navigate to: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a Project" at the top
   - Click "New Project"
   - Name it "ScholarSync" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (unless you have a Google Workspace)
   - Click "Create"
   - Fill in required fields:
     - App name: "ScholarSync"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip "Scopes" for now (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

5. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "ScholarSync Web Client"
   - **Authorized JavaScript origins:**
     - Add: `http://localhost:5173` (your frontend dev URL)
     - Add: `https://yourdomain.com` (your production URL when deployed)
   - **Authorized redirect URIs:**
     - Add: `http://localhost:5173` (for development)
     - Add: `https://yourdomain.com` (for production)
   - Click "Create"
   - **COPY THE CLIENT ID** - you'll need this!

### Step 2: Add Client ID to Backend

1. Open `backend/.env`
2. Add this line:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
3. Replace with your actual Client ID from Google Console
4. Save the file
5. **Restart your backend server** (important!)

### Step 3: Add Client ID to Frontend

1. Open `frontend/.env`
2. Find the line: `VITE_GOOGLE_CLIENT_ID=your-google-client-id`
3. Replace with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
4. Save the file
5. **Restart your frontend dev server** (important!)

### Step 4: Test the Integration

1. **Make sure both servers are running:**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Navigate to Login Page:**
   - Go to: http://localhost:5173/login

3. **Test Google Sign In:**
   - You should see a "Continue with Google" button
   - Click it
   - A Google login popup should appear
   - Sign in with your Google account
   - After successful login, you should be redirected to `/notes`
   - Check the browser console for any errors

### Step 5: Verify Everything Works

✅ **New User Sign Up:**
   - Use a Google account that hasn't been used before
   - Should create a new account automatically
   - Should redirect to `/notes` page

✅ **Existing User Login:**
   - If you already have an account with the same email
   - Google login should link to that account
   - Your `googleId` will be saved to the existing user

✅ **Profile Picture:**
   - After Google login, check if profile picture is saved
   - Look in MongoDB to see `profilePicture` field populated

✅ **Email Verification:**
   - Google users automatically have `isEmailVerified: true`

## Troubleshooting

### Error: "Invalid Client ID"
- Make sure you copied the **full Client ID** including `.apps.googleusercontent.com`
- Verify the Client ID is identical in both `.env` files
- Restart both servers after changing `.env` files

### Error: "Unauthorized JavaScript origin"
- Go back to Google Cloud Console
- Add `http://localhost:5173` to Authorized JavaScript origins
- Wait a few minutes for changes to propagate

### Error: "Invalid token"
- Check that `GOOGLE_CLIENT_ID` is set in `backend/.env`
- Verify the backend can read the environment variable
- Check backend console for error messages

### Google popup doesn't appear
- Check browser console for errors
- Make sure popup blockers are disabled
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `frontend/.env`
- Check that frontend server was restarted after adding the variable

### User created but login fails
- Check backend logs for error messages
- Verify JWT secret is set in backend `.env`
- Check that User model has `googleId`, `profilePicture`, `isEmailVerified` fields

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to Git (they're already in `.gitignore`)
- Keep your Client ID secure (though it's public-facing, don't share unnecessarily)
- For production, use a different Client ID with production URLs
- Consider setting up Google OAuth2 Client Secret for additional security

## Production Deployment

When deploying to production:

1. **Create new OAuth credentials** in Google Console for production
2. **Add production URLs** to Authorized JavaScript origins:
   - `https://yourdomain.com`
3. **Add environment variables** to your hosting platform:
   - Backend: `GOOGLE_CLIENT_ID=prod-client-id`
   - Frontend: `VITE_GOOGLE_CLIENT_ID=prod-client-id`
4. **Update OAuth consent screen** to verified status (submit for review)
5. **Remove test mode** once approved by Google

## Additional Features to Consider

### Profile Picture Display
The `profilePicture` URL is saved in the user document. You can display it in:
- Navbar (user avatar)
- Profile page
- Comment author avatars

Example:
```jsx
{user.profilePicture ? (
  <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
) : (
  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
    {user.name?.charAt(0)?.toUpperCase()}
  </div>
)}
```

### Account Linking
Users can now link Google to an existing account:
1. User signs up with email/password
2. Later, they sign in with Google using the same email
3. Backend automatically links the Google account
4. User can now use either method to log in

### Email Verification
Google users are automatically verified (`isEmailVerified: true`). You can:
- Skip email verification for Google users
- Show verified badge on profile
- Grant additional permissions to verified users

## Need Help?

If you encounter issues:
1. Check browser console (F12) for frontend errors
2. Check backend terminal for server errors
3. Verify both `.env` files have the correct Client ID
4. Make sure both servers were restarted after changes
5. Check that Google Cloud Console credentials are properly configured

## Summary

✅ **What's Done:**
- All backend code for Google OAuth
- All frontend integration code
- Google Sign In button in Login page
- Error handling and success notifications

❌ **What You Need to Do:**
1. Get Google Client ID from Google Cloud Console (5 minutes)
2. Add Client ID to both `.env` files (1 minute)
3. Restart both servers (30 seconds)
4. Test the login flow (2 minutes)

**Total Time:** ~10 minutes to complete setup!

## Questions?

The implementation follows OAuth 2.0 best practices:
- Token verification on the backend (secure)
- JWT tokens for session management
- Automatic account creation/linking
- Profile picture integration
- Email verification for Google users

Everything is ready - you just need to add your Google Client ID! 🚀
