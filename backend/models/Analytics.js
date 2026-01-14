const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Page and URL info
  pageUrl: {
    type: String,
    required: true,
    index: true
  },
  
  // User identification (optional - only for authenticated users)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  
  // Session tracking
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // Network info
  ipAddress: {
    type: String,
    required: true
  },
  
  // Browser info
  userAgent: {
    type: String,
    required: true
  },
  
  // Event type
  eventType: {
    type: String,
    enum: ['page_view', 'login', 'logout', 'action', 'registration', 'api_call'],
    default: 'page_view',
    index: true
  },
  
  // Flexible event data storage
  eventData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for common queries
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
