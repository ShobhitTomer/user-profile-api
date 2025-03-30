# User Profile Management API

A RESTful API for managing user profiles with authentication.

## Features

- User registration with profile creation
- User authentication using JWT
- Profile retrieval
- Profile updates (including profile picture upload)
- Secure password storage with bcrypt
- MongoDB database integration
- Cloudinary for profile picture storage

## Tech Stack

- Backend: Express.js with TypeScript
- Database: MongoDB
- Authentication: JWT
- File Storage: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/user-profile-api.git
cd user-profile-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your details
   configuration

```bash
cp .env.example .env
# Edit the .env file with your configuration
```

4. Start the development server

```bash
npm run dev
```

5. Import `postman_collection.json` in postman for testing

## API Documentation

### Authentication Endpoints

1. Register a new user

- `POST /api/users/register`
- Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "address": "123 Main St, City, Country"
}
```

- Response:

```json
{
  "id": "user_id",
  "accessToken": "jwt_token",
  "message": "User created successfully"
}
```

2. Login

- `POST /api/users/login`
- Request body:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

- Response:

```json
{
  "id": "user_id",
  "accessToken": "jwt_token",
  "message": "Login successful"
}
```

### Profile Endpoints (Protected, require JWT authentication)

1. Get user profile

- `GET /api/users/profile`
- Headers: `Authorization: Bearer <token>`
- Response:

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, City, Country",
  "bio": "About me...",
  "profilePicture": "https://cloudinary.com/...",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

2. Update user profile

- `PATCH /api/users/profile`
- Headers: `Authorization: Bearer <token>`
- Request body (multipart/form-data):
  - name (optional)
  - address (optional)
  - bio (optional)
  - profilePicture (file, optional)
- Response:

```json
{
  "user": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "john@example.com",
    "address": "New Address",
    "bio": "Updated bio",
    "profilePicture": "https://cloudinary.com/...",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Postman Collection

import the file called `postman_collection.json` in your postman for testing APIs:

```json
{
  "info": {
    "_postman_id": "YOUR_COLLECTION_ID",
    "name": "User Profile API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"John Doe\",\n    \"email\": \"john@example.com\",\n    \"password\": \"securepassword\",\n    \"address\": \"123 Main St, City, Country\",\n    \"bio\": \"Software developer with 5+ years experience\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "register"]
            },
            "description": "Register a new user with profile details"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"john@example.com\",\n    \"password\": \"securepassword\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "login"]
            },
            "description": "Login with email and password to receive JWT token"
          }
        }
      ]
    },
    {
      "name": "Profile",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{authToken}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "profile"]
            },
            "description": "Get the authenticated user's profile"
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{authToken}}",
                  "type": "string"
                }
              ]
            },
            "method": "PATCH",
            "header": [],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "name",
                  "value": "Updated Name",
                  "type": "text"
                },
                {
                  "key": "address",
                  "value": "456 New Address, City, Country",
                  "type": "text"
                },
                {
                  "key": "bio",
                  "value": "Updated bio information",
                  "type": "text"
                },
                {
                  "key": "profilePicture",
                  "type": "file",
                  "src": "/path/to/image.jpg"
                }
              ]
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "profile"]
            },
            "description": "Update the authenticated user's profile"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5513"
    },
    {
      "key": "authToken",
      "value": "your_jwt_token_here"
    }
  ]
}
```
