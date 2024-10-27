# The Gram - Backend

This is the backend for **The Gram**, a modern social media application built with Node.js and Express. The backend manages user authentication, post handling, comments, notifications, and messaging with real-time capabilities via Socket.io.

## Table of Contents
- [The Gram - Backend](#the-gram---backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Folder Structure](#folder-structure)

## Features

- **User Authentication**: Register, login, logout, and JWT-based authentication.
- **Profile Management**: Update profile info, manage followers and friends.
- **Post Management**: Create, update, delete, and view posts, with options to like, comment, and save posts.
- **Notifications**: Create and manage notifications.
- **Messaging**: Real-time messaging using Socket.io.
- **MongoDB Integration**: Mongoose used for MongoDB connections and data management.

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB** with Mongoose
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **Cors** for cross-origin resource sharing
- **dotenv** for environment management
- **Nodemon** for development server auto-restart

## Folder Structure

The project structure is organized as follows:

```plaintext
the-gram-backend/
├── controllers/          # Business logic for each module
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── commentController.js
│   ├── notificationController.js
│   └── messageController.js
├── middleware/           # Middleware functions
│   └── auth.js
├── models/               # Mongoose schemas and models
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Notification.js
│   └── Message.js
├── routes/               # API route definitions
│   ├── authRoute.js
│   ├── userRoute.js
│   ├── postRoute.js
│   ├── commentRoute.js
│   ├── notificationRoute.js
│   └── messageRoute.js
├── socketServer.js       # Socket.io server logic
├── server.js             # Main server file
├── .env                  # Environment variables
└── package.json
```

### Setup and Installation
1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/the-gram-backend.git
    ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see below).

4. Start the server:


    ```plaintext
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    FRONTEND_URL=http://localhost:3000
    ```

## API Endpoints

### Authentication Routes

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | `/api/register`        | Register a new user     |
| POST   | `/api/login`           | User login              |
| POST   | `/api/logout`          | User logout             |
| POST   | `/api/refresh_token`   | Refresh JWT token       |

### User Routes

| Method | Endpoint               | Description                       |
|--------|------------------------|-----------------------------------|
| GET    | `/api/search`          | Search for users                 |
| GET    | `/api/user/:id`        | Get user details                 |
| PATCH  | `/api/user/:id`        | Update user details              |
| PATCH  | `/api/user/:id/friend` | Send a friend request            |
| PATCH  | `/api/user/:id/unfriend`| Remove a friend                 |

### Post Routes

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/posts/:id`       | Create a post                   |
| GET    | `/api/posts`           | Get all posts                   |
| PATCH  | `/api/post/:id`        | Update a specific post          |
| DELETE | `/api/post/:id`        | Delete a specific post          |
| PATCH  | `/api/post/:id/like`   | Like a post                     |
| PATCH  | `/api/post/:id/unlike` | Unlike a post                   |
| GET    | `/api/userposts/:id`   | Get posts of a user            |
| PATCH  | `/api/save/:id`        | Save a post                     |
| PATCH  | `/api/unsave/:id`      | Unsave a post                   |
| GET    | `/api/getsavedpost`    | Get saved posts                 |

### Comment Routes

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/api/comment`         | Add a comment to a post           |
| PATCH  | `/api/comment/:id`     | Update a specific comment         |
| DELETE | `/api/comment/:id`     | Delete a specific comment         |

### Notification Routes

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/notification`     | Create a notification                |
| DELETE | `/api/notification/:id` | Remove a notification                |
| GET    | `/api/notifications`    | Get all notifications                |
| DELETE | `/api/deleteallnotification` | Delete all notifications       |
| PATCH  | `/api/isreadnotification/:id` | Mark notification as read      |

### Message Routes

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/message`         | Send a message                      |
| GET    | `/api/conversations`   | Get conversations for a user        |
| GET    | `/api/message/:id`     | Get messages in a conversation      |
| DELETE | `/api/message/:id`     | Delete a message                    |
| DELETE | `/api/messages/:id`    | Delete all messages in a conversation |

## License

This project is licensed under the MIT License.
