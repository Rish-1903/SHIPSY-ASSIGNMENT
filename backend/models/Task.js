import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed', 'on-hold'],
      message: 'Status must be pending, in-progress, completed, or on-hold'
    },
    default: 'pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Priority must be low, medium, high, or critical'
    },
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    max: [1000, 'Estimated hours cannot exceed 1000'],
    default: 0
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    max: [1000, 'Actual hours cannot exceed 1000'],
    default: 0
  },
  efficiencyScore: {
    type: Number,
    default: 0,
    min: [0, 'Efficiency score cannot be negative'],
    max: [500, 'Efficiency score cannot exceed 500%']
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Calculate efficiency score before saving
taskSchema.pre('save', function(next) {
  if (this.estimatedHours > 0 && this.actualHours >= 0) {
    if (this.actualHours === 0) {
      this.efficiencyScore = 100; // Perfect efficiency if no time spent
    } else {
      this.efficiencyScore = (this.estimatedHours / this.actualHours) * 100;
    }
  } else {
    this.efficiencyScore = 0;
  }
  next();
});

// Index for better query performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });

export default mongoose.model('Task', taskSchema);
