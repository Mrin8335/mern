# Web Application

This is a full-stack web application with a Node.js Express backend and a React frontend.

## Features

- **Backend:**
  - User authentication with JWT.
  - API endpoints for managing users, appointments, visitors, and passes.
  - File uploads using Multer.
  - Email notifications with Nodemailer.
- **Frontend:**
  - User interface built with React and Vite.
  - Client-side routing with React Router.
  - Data visualization with Chart.js.

## Technologies Used

**Backend:**
- Node.js
- Express
- MongoDB (with Mongoose)
- JSON Web Token (JWT) for authentication
- Bcrypt.js for password hashing
- Nodemailer for sending emails
- Multer for file uploads
- Twilio for messaging
- Speakeasy for OTP

**Frontend:**
- React
- Vite
- React Router
- Axios for API requests
- Chart.js for charts

## Local Development Setup

To run this project locally, you will need to have Node.js and npm installed.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run the development server
npm start
```
The backend will be running on `http://localhost:3000` (or the port specified in your environment).

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend development server will be running on `http://localhost:5173` (or the next available port).

## Building for Production

### Backend

To build the backend for production, run:
```bash
cd backend
npm run build
```
This will create a `dist` folder with the transpiled code. The production server can be started with `npm run serve`.

### Frontend

To build the frontend for production, run:
```bash
cd frontend
npm run build
```
This will create a `dist` folder with the static files.

## Deployment

This project is configured for easy deployment on Render using the included `render.yaml` file.

1.  **Push your code** to a GitHub repository.
2.  Go to the Render dashboard and create a new **Blueprint**.
3.  **Connect your GitHub account** and select the repository.
4.  Render will automatically detect the `render.yaml` file and create the `backend` (Web Service) and `frontend` (Static Site).
5.  Approve the creation. Render will build and deploy both services.

The `render.yaml` is configured to automatically set the `VITE_API_URL` on the frontend to the correct backend URL.
