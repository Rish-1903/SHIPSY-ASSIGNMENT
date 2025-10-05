# SHIPSY-ASSIGNMENT 2022UCA1890 Rishabh Dang
# Task Manager - AI Campus Assignment

## 🚀 Live Deployment

- **Frontend:** https://shipsy-assignment-nson.vercel.app
- **Backend API:** https://shipsy-assignment-five.vercel.app
- **API Health Check:** https://shipsy-assignment-five.vercel.app/api/health

## 📋 Assignment Requirements Checklist

### ✅ Core Requirements
- [x] **Authentication System** - User registration and login
- [x] **CRUD Operations** - Create, Read, Update, Delete tasks
- [x] **Required Fields** - Text, Enum, Boolean, Calculated (efficiency score)
- [x] **Pagination** - 8 items per page
- [x] **Filtering & Search** - Status, priority, urgency, and text search
- [x] **Code Quality** - OOP concepts, modularity, clean code
- [x] **Deployment** - Vercel + MongoDB Atlas

### ✅ Bonus Features
- [x] **Statistics Dashboard** - Task analytics and insights
- [x] **Advanced Filtering** - Multiple filter combinations
- [x] **Search Functionality** - Real-time search across tasks
- [x] **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties
- **React Hooks** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

### Deployment & Infrastructure
- **Vercel** - Frontend and backend hosting
- **MongoDB Atlas** - Cloud database service
- **Environment Variables** - Secure configuration

## 📁 Project Structure

```bash
SHIPSY-ASSIGNMENT/
├── backend/
│ ├── models/
│ │ ├── User.js # User schema and model
│ │ └── Task.js # Task schema and model
│ ├── routes/
│ │ ├── auth.js # Authentication routes
│ │ └── tasks.js # Task management routes
│ ├── middleware/
│ │ ├── auth.js # JWT authentication middleware
│ │ └── validation.js # Request validation
│ ├── server.js # Express server setup
│ ├── package.json
│ └── vercel.json # Vercel deployment config
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Login.jsx # Authentication component
│ │ │ ├── TaskManager.jsx # Main task management
│ │ │ ├── TaskList.jsx # Task listing with filters
│ │ │ ├── TaskForm.jsx # Create/edit task form
│ │ │ └── LoadingSpinner.jsx # Loading indicator
│ │ ├── App.jsx # Main application component
│ │ ├── App.css # Main styles
│ │ ├── index.jsx # Application entry point
│ │ └── index.css # Global styles
│ ├── package.json
│ ├── vite.config.js # Vite configuration
│ └── vercel.json # Vercel deployment config
└── README.md
```


## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```
## Task Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max: 100 chars),
  description: String (required, max: 1000 chars),
  status: String (enum: ['pending', 'in-progress', 'completed', 'on-hold']),
  priority: String (enum: ['low', 'medium', 'high', 'critical']),
  isUrgent: Boolean (default: false),
  estimatedHours: Number (min: 0, max: 1000),
  actualHours: Number (min: 0, max: 1000),
  efficiencyScore: Number (calculated automatically),
  dueDate: Date (optional),
  userId: String (required),
  createdAt: Date,
  updatedAt: Date
}
```
