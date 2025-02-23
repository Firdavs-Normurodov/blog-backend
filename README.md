# Blog Backend API

A Node.js Express backend for a blog site with authentication and post management.

## Features

- User authentication (signup/signin)
- JWT-based authentication with cookie storage
- Profile picture upload
- Blog post CRUD operations
- Image upload for blog posts
- Protected routes for authenticated users
- Public routes for viewing posts

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create an uploads directory:
```bash
mkdir uploads
```

4. Configure environment variables:
- Copy `.env` file from src directory to root directory
- Update the variables as needed

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login user
- POST `/api/auth/logout` - Logout user

### Posts
- GET `/api/posts` - Get all posts (public)
- GET `/api/posts/:id` - Get single post (public)
- POST `/api/posts` - Create new post (protected)
- PUT `/api/posts/:id` - Update post (protected)
- DELETE `/api/posts/:id` - Delete post (protected)

## File Upload

The API supports image uploads for both user profiles and blog posts. Images are stored in the `uploads` directory.
