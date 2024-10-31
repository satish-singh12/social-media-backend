# The Gram - Backend

This is the backend for **The Gram**, a modern social media application built with Node.js and Express. The backend manages user authentication, post handling, comments, notifications, and messaging with real-time capabilities via Socket.io.

## Table of Contents
- [The Gram - Backend](#the-gram---backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Folder Structure](#folder-structure)
    - [Setup and Installation](#setup-and-installation)
  - [API Endpoints](#api-endpoints)
    - [Authentication Routes](#authentication-routes)
    - [User Routes](#user-routes)
    - [Post Routes](#post-routes)
    - [Comment Routes](#comment-routes)
    - [Notification Routes](#notification-routes)
    - [Message Routes](#message-routes)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
  - [License](#license)

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
├── controllers/          # Contains business logic for each module, defining how requests are handled
│   ├── authController.js           # Handles authentication-related functions (e.g., login, register)
│   ├── userController.js           # Manages user-related actions (e.g., profile updates, fetching user data)
│   ├── postController.js           # Handles posts functionality (e.g., create, update, delete posts)
│   ├── commentController.js        # Manages actions on comments (e.g., add, delete comments)
│   ├── notificationController.js   # Handles notifications (e.g., create, update, mark as read)
│   └── messageController.js        # Manages messaging functionalities (e.g., send, delete messages)
│
├── middleware/           # Holds middleware functions that process requests before they reach controllers
│   └── auth.js                    # Authentication middleware to verify user tokens and protect routes
│
├── models/               # Defines Mongoose schemas and models for database structure
│   ├── User.js                     # User schema, defining fields and data structure for users
│   ├── Post.js                     # Post schema, defining fields for each post
│   ├── Comment.js                  # Comment schema for storing comments on posts
│   ├── Notification.js             # Notification schema to store notifications for users
│   └── Message.js                  # Message schema for storing chat messages between users
│
├── routes/               # Manages API route definitions, linking endpoints to respective controllers
│   ├── authRoute.js                # Authentication routes (e.g., login, signup)
│   ├── userRoute.js                # User-related routes (e.g., profile updates)
│   ├── postRoute.js                # Post-related routes (e.g., create, delete posts)
│   ├── commentRoute.js             # Comment-related routes (e.g., add, delete comments)
│   ├── notificationRoute.js        # Notification routes (e.g., mark as read)
│   └── messageRoute.js             # Message routes for real-time or direct messages
│
├── socketServer.js       # Contains Socket.io server logic to manage real-time events like messaging
├── app.js                # Initializes and configures the Express app, sets up middleware, and routes
├── db.js                 # Configures the database connection to MongoDB using Mongoose
├── server.js             # Entry point to start the server, initializes the app and connects to the database
├── .env                  # Environment variables (e.g., database URI, secret keys)
└── package.json          # Lists dependencies and scripts for the project
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

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000).

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`


## License

This project is licensed under the MIT License.
