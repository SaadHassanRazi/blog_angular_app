# Blog API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Post Endpoints](#post-endpoints)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

## Overview

This is a RESTful API for a blog application built with Node.js, Express, TypeScript, and Prisma with PostgreSQL.

**Base URL:** `http://localhost:3000` (or your deployed URL)

**Content-Type:** `application/json`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected endpoints require a Bearer token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication Endpoints

#### 1. Register User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing fields:*
```json
{
  "message": "Email and password are required."
}
```

*400 Bad Request - User already exists:*
```json
{
  "message": "User already exists."
}
```

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

#### 2. Login User

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing fields:*
```json
{
  "message": "Email and password are required."
}
```

*400 Bad Request - Invalid credentials:*
```json
{
  "message": "Invalid credentials."
}
```

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

### Post Endpoints

#### 3. Create Post

**POST** `/posts/post`

Creates a new blog post. **Requires Authentication.**

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It can be as long as needed and support markdown or plain text."
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It can be as long as needed and support markdown or plain text.",
  "authorId": 1,
  "createdAt": "2025-07-22T10:30:00.000Z"
}
```

**Error Responses:**

*400 Bad Request - Missing fields:*
```json
{
  "message": "Title and content are required."
}
```

*401 Unauthorized - Missing token:*
```json
{
  "message": "Unauthorized: Token missing."
}
```

*401 Unauthorized - Invalid token:*
```json
{
  "message": "Unauthorized: Token invalid."
}
```

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

#### 4. Get Posts (Paginated)

**GET** `/posts/`

Retrieves all blog posts with pagination. **No authentication required.**

**Query Parameters:**
- `page` (optional): Page number (default: 1)

**Example Request:**
```
GET /posts/?page=1
```

**Success Response (200 OK):**
```json
{
  "currentPage": 1,
  "totalPages": 3,
  "totalPosts": 15,
  "posts": [
    {
      "id": 3,
      "title": "Latest Blog Post",
      "content": "This is the most recent blog post...",
      "authorId": 2,
      "createdAt": "2025-07-22T15:45:00.000Z",
      "author": {
        "id": 2,
        "email": "author@example.com"
      }
    },
    {
      "id": 2,
      "title": "Second Blog Post",
      "content": "This is another blog post...",
      "authorId": 1,
      "createdAt": "2025-07-22T12:30:00.000Z",
      "author": {
        "id": 1,
        "email": "user@example.com"
      }
    }
  ]
}
```

**Notes:**
- Posts are ordered by creation date (newest first)
- Page size is fixed at 5 posts per page
- If no page parameter is provided, defaults to page 1

**Error Response:**

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

#### 5. Update Post

**PUT** `/posts/post/:id`

Updates an existing blog post. **Requires Authentication.** Users can only update their own posts.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Post ID (integer)

**Example Request:**
```
PUT /posts/post/1
```

**Request Body:**
```json
{
  "title": "Updated Blog Post Title",
  "content": "This is the updated content of the blog post."
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Blog Post Title",
  "content": "This is the updated content of the blog post.",
  "authorId": 1,
  "createdAt": "2025-07-22T10:30:00.000Z"
}
```

**Error Responses:**

*400 Bad Request - Missing fields:*
```json
{
  "message": "Title and content are required."
}
```

*401 Unauthorized - Missing token:*
```json
{
  "message": "Unauthorized: Token missing."
}
```

*401 Unauthorized - Invalid token:*
```json
{
  "message": "Unauthorized: Token invalid."
}
```

*403 Forbidden - Not post owner:*
```json
{
  "message": "You can only update your own posts"
}
```

*404 Not Found - Post doesn't exist:*
```json
{
  "message": "Post not found"
}
```

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

#### 6. Delete Post

**DELETE** `/posts/post/:id`

Deletes an existing blog post. **Requires Authentication.** Users can only delete their own posts.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters:**
- `id`: Post ID (integer)

**Example Request:**
```
DELETE /posts/post/1
```

**Success Response (200 OK):**
```json
{
  "message": "Post deleted successfully."
}
```

**Error Responses:**

*401 Unauthorized - Missing token:*
```json
{
  "message": "Unauthorized: Token missing."
}
```

*401 Unauthorized - Invalid token:*
```json
{
  "message": "Unauthorized: Token invalid."
}
```

*403 Forbidden - Not post owner:*
```json
{
  "message": "You can only delete your own posts"
}
```

*404 Not Found - Post doesn't exist:*
```json
{
  "message": "Post not found"
}
```

*500 Internal Server Error:*
```json
{
  "message": "Internal server error."
}
```

---

## Error Handling

The API follows standard HTTP status codes and returns consistent error responses in JSON format.

### Common Error Response Format:
```json
{
  "message": "Error description here"
}
```

### Authentication Errors:
- **401 Unauthorized:** Token is missing, invalid, or expired
- **403 Forbidden:** User doesn't have permission to perform the action

### Validation Errors:
- **400 Bad Request:** Required fields are missing or invalid data provided

### Resource Errors:
- **404 Not Found:** Requested resource doesn't exist

### Server Errors:
- **500 Internal Server Error:** Unexpected server error occurred

---

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Integration Examples

### Frontend Authentication Flow

1. **Register a new user:**
```javascript
const registerUser = async (email, password) => {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('User registered:', data.user);
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

2. **Login and store token:**
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage or state management
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful');
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

3. **Create a post with authentication:**
```javascript
const createPost = async (title, content) => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('/posts/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Post created:', data);
    } else {
      console.error('Post creation failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

4. **Fetch posts with pagination:**
```javascript
const fetchPosts = async (page = 1) => {
  try {
    const response = await fetch(`/posts/?page=${page}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Posts:', data.posts);
      console.log('Pagination:', {
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalPosts: data.totalPosts
      });
    } else {
      console.error('Failed to fetch posts:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

---

## Data Models

### User Model
```typescript
{
  id: number;          // Auto-incremented primary key
  email: string;       // Unique email address
  password: string;    // Hashed password (bcrypt)
  createdAt: Date;     // Account creation timestamp
}
```

### Post Model
```typescript
{
  id: number;          // Auto-incremented primary key
  title: string;       // Post title
  content: string;     // Post content
  authorId: number;    // Foreign key to User.id
  createdAt: Date;     // Post creation timestamp
}
```

---

## Notes for Frontend Integration

1. **Token Storage:** Store the JWT token securely (localStorage, sessionStorage, or secure cookies)
2. **Token Refresh:** Currently, tokens don't expire automatically, but implement refresh logic if needed
3. **Error Handling:** Always handle both network errors and API error responses
4. **Pagination:** The posts endpoint returns paginated results (5 posts per page)
5. **Authorization:** Include the Bearer token for all protected endpoints
6. **Content-Type:** Always set `Content-Type: application/json` for POST/PUT requests
7. **CORS:** Ensure CORS is configured properly for your frontend domain

This API is ready for integration with any frontend framework (React, Vue, Angular, etc.) and provides all necessary endpoints for a complete blog application.
