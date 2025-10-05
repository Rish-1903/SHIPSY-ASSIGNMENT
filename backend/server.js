import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://shipsy-assignment-nson.vercel.app',
    'https://shipsy-assignment-five.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected Successfully!');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return null;
  }
};

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Task Manager API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Simple auth routes (work without database)
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, email and password'
    });
  }

  res.json({
    success: true,
    message: 'Registration successful',
    token: 'jwt-token-' + Date.now(),
    user: {
      id: 'user-' + Date.now(),
      username: username,
      email: email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    token: 'jwt-token-' + Date.now(),
    user: {
      id: 'user-12345',
      username: 'testuser',
      email: email
    }
  });
});

// Task routes (work without database for now)
app.get('/api/tasks', (req, res) => {
  // Mock tasks data
  const mockTasks = [
    {
      _id: '1',
      title: 'Sample Task 1',
      description: 'This is a sample task',
      status: 'pending',
      priority: 'medium',
      isUrgent: false,
      estimatedHours: 2,
      actualHours: 0,
      efficiencyScore: 0,
      userId: 'user-12345'
    },
    {
      _id: '2', 
      title: 'Sample Task 2',
      description: 'Another sample task',
      status: 'in-progress',
      priority: 'high',
      isUrgent: true,
      estimatedHours: 4,
      actualHours: 2,
      efficiencyScore: 200,
      userId: 'user-12345'
    }
  ];

  res.json({
    success: true,
    tasks: mockTasks,
    pagination: {
      current: 1,
      pages: 1,
      total: 2,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority, isUrgent, estimatedHours, actualHours } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }

  // Create mock task
  const newTask = {
    _id: 'task-' + Date.now(),
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    isUrgent: isUrgent || false,
    estimatedHours: estimatedHours || 0,
    actualHours: actualHours || 0,
    efficiencyScore: 0,
    userId: 'user-12345',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Task created successfully',
    task: newTask
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    task: {
      ...req.body,
      _id: taskId,
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// Statistics endpoint
app.get('/api/tasks/stats/summary', (req, res) => {
  res.json({
    success: true,
    stats: {
      byStatus: [
        { _id: 'pending', count: 1 },
        { _id: 'in-progress', count: 1 }
      ],
      totalTasks: 2,
      urgentTasks: 1
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found: ' + req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/tasks',
      'POST /api/tasks',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'GET /api/tasks/stats/summary'
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
