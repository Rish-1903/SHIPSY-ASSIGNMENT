import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import { validateTask, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all tasks with pagination, filtering, and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { userId: req.user._id };
    
    // Apply filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.isUrgent) filter.isUrgent = req.query.isUrgent === 'true';
    
    // Search in title and description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default sort by newest
    if (req.query.sort) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      tasks,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
});

// Create new task
router.post('/', validateTask, handleValidationErrors, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user._id
    };
    
    const task = new Task(taskData);
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
});

// Update task
router.put('/:id', validateTask, handleValidationErrors, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

// Get task statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEstimatedHours: { $sum: '$estimatedHours' },
          totalActualHours: { $sum: '$actualHours' }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments({ userId: req.user._id });
    const urgentTasks = await Task.countDocuments({ 
      userId: req.user._id, 
      isUrgent: true 
    });

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        totalTasks,
        urgentTasks
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

export default router;
