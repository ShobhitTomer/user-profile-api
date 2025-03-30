# Testing the User Profile API

This document outlines how to test the core user-profile-api functionality in this project. Make sure to first start the backend.

## 1. Project Setup

- Clone or download this repository.
- Install dependencies:

```bash
npm install
```

- Configure environment variables in `.env` or `.env.example` (e.g., `VITE_API_URL`).

## 2. Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to (http://localhost:5173) or the port shown in your console.

## 3. Testing Workflows

### Register a New User

1. Go to (http://localhost:5173/register).
2. Fill in the required fields (Name, Email, Password, Address).
3. Submit the form.

### Log In

1. Navigate to (http://localhost:5173/login).
2. Enter your registered email and password.
3. Submit to log in.

### View and Update Profile

1. Once logged in, you will be redirected to your Profile page.
2. Click "Edit Profile" to update your name, address, bio, or profile picture.
3. Submit to push the update to the server.

## 4. Verifying API Responses

- Check network requests in your browser's developer tools to view the API calls.
- Inspect any toast notifications or error messages for immediate feedback.

## 5. Notes

- Make sure the API URL is set correctly in your `.env` file.
- If anything fails, re-check environment variables and logs.
