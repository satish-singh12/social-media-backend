# Social Media Backend API

This is the backend code for a social media platform that allows users to register, log in, manage profiles, search for users, and interact with their data. This application is built using Node.js, Express.js, MongoDB, and JWT for authentication.

## Features

- User registration and login
- JWT-based authentication
- User search functionality
- Middleware for user authentication
- MongoDB for database storage
- Secure password handling using bcrypt
- Token-based session management using access and refresh tokens

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- A `.env` file with the following environment variables:


## Installation

1. Clone the repository:

 ```bash
 git clone <repository-url>

2. Install dependencies:

```
npm install   

3. Set up the .env file by creating a .env file in the root directory with your environment variables.

4. Start the server:

```
npm start

The server will run on http://localhost:5000.

API Endpoints

Authentication Routes

- POST /api/register - Register a new user
- POST /api/login - Log in a user and receive an access token
- POST /api/logout - Log out a user and clear the refresh token
- POST /api/refresh_token - Generate a new access token using the refresh token

User Routes

- GET /api/search?username=<username> - Search for users by username
- GET /api/user/:id - Get user profile by user ID

Middleware

- auth.js - Middleware to verify JWT tokens and authorize users

Models

- userModel.js - MongoDB model defining user schema, including username, fullname, email, password, and more.

Code Structure

```
├── controllers
│   ├── authController.js        # Handles user authentication
│   ├── userController.js        # Handles user-related logic
├── middleware
│   └── auth.js                  # JWT authentication middleware
├── models
│   └── userModel.js             # User schema for MongoDB
├── routes
│   ├── authRoute.js             # Routes for authentication
│   └── userRoute.js             # Routes for user operations
├── .env                         # Environment variables
├── server.js                    # Main server file

Usage

1. Register a user:

```
POST /api/register
{
  "username": "exampleuser",
  "fullname": "Example User",
  "email": "user@example.com",
  "password": "password123",
  "gender": "male"
}

2. Login a user:

```
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

3. Search for users:

```
GET /api/search?username=<username>

License

This project is licensed under the MIT License - see the LICENSE file for details.

```
This `README.md` file provides a clear structure for understanding the project's purpose, installation steps, features, and usage examples. You can customize it further based on your specific repository details.