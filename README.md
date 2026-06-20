# Social App

A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, posts with image uploads, likes, comments, follow/unfollow, and real-time direct messaging.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (access + refresh tokens) with bcrypt password hashing
- **File Storage:** Cloudinary (via Multer)
- **Deployment:** Vercel (serverless functions)

### Frontend
- **Framework:** React 19 with Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Features

### User Management
- Register and login with JWT-based authentication
- Profile pages with username, full name, bio, and profile picture
- Edit profile (update name, bio, profile picture)
- Search users by username
- Follow / unfollow other users

### Posts
- Create posts with optional image upload (Cloudinary)
- Feed page showing posts from followed users
- Like and unlike posts
- Comment on posts
- View individual post details
- Delete your own posts
- View all media attachments from a user

### Messaging
- Real-time one-on-one chat
- View all active chats
- Send and receive messages

### UI / UX
- Responsive design with Tailwind CSS
- Navigation bar
- Settings page

## Project Structure

```
social/
├── backend/
│   ├── api/
│   │   └── index.js              # Vercel serverless entry point
│   ├── src/
│   │   ├── app.js                # Express app setup (middleware, routes, error handler)
│   │   ├── index.js              # Server entry point
│   │   ├── constants.js          # App constants
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   └── message.controller.js
│   │   ├── db/
│   │   │   └── index.js          # MongoDB connection
│   │   ├── middlewares/
│   │   │   ├── multer.middleware.js
│   │   │   └── verifyJWT.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── post.model.js
│   │   │   └── message.model.js
│   │   ├── routes/
│   │   │   └── users.routes.js   # All API routes
│   │   └── utils/
│   │       ├── ApiErrors.js
│   │       ├── ApiResponse.js
│   │       ├── asyncHandler.js
│   │       ├── cloudinary.js
│   │       └── multer-cloudinary.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Root component with routing
    │   ├── main.jsx              # Entry point
    │   ├── index.css             # Global styles (Tailwind)
    │   ├── api/
    │   │   └── axios.js          # Axios instance with interceptors
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state management
    │   └── pages/
    │       ├── Dashboard.jsx     # Feed page
    │       ├── Login.jsx
    │       ├── Profile.jsx
    │       ├── EditProfile.jsx
    │       ├── NewPost.jsx
    │       ├── Post.jsx          # Single post view
    │       ├── AllChats.jsx      # Chat list
    │       ├── Chatbox.jsx       # Direct messaging
    │       ├── Attachments.jsx   # User media gallery
    │       ├── SearchUser.jsx
    │       └── Settings.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── vercel.json
```

## API Endpoints

All endpoints are prefixed with `/api/v1/users`.

### Authentication
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | `/register`      | Register a new user |
| POST   | `/login`         | Login a user        |

### User Profile
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/:username`          | Get user profile       |
| PUT    | `/profile/:username`  | Update profile (with pfp upload) |
| POST   | `/follow/:username`   | Toggle follow/unfollow |
| GET    | `/search`             | Search users           |
| GET    | `/attachments`        | Get user's media attachments |

### Posts
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| GET    | `/feed`            | Get feed posts         |
| GET    | `/post`            | Get user's posts       |
| GET    | `/post/get`        | Get a single post      |
| POST   | `/post/add`        | Create a post (with image) |
| POST   | `/post/like`       | Like/unlike a post     |
| POST   | `/post/comment`    | Comment on a post      |
| POST   | `/post/delete`     | Delete a post          |

### Messaging
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/chats/:user`              | Get all chats for a user |
| GET    | `/chatbox/:targetUser`      | Get messages with a user |
| POST   | `/chatbox/:targetUser`      | Send a message           |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URL=your_mongodb_connection_string
   CORS_OG=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1/users
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

## Deployment

Both the backend and frontend are configured for deployment on **Vercel**.
https://social-frontend-ctxnndvx5-mannatkathuria23-2294s-projects.vercel.app/


- Backend uses `vercel.json` with serverless functions via `@vercel/node`
- Frontend uses `vercel.json` for static SPA deployment with `vite build`

## License

ISC