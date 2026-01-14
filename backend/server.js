const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registration');
const userRoutes = require('./routes/user');
const githubRoutes = require('./routes/github');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const { trackAnalytics } = require('./middleware/analytics');

const app = express();

// Database connection (Optional - app will work without it for testing)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.warn('MongoDB connection failed, running without database:', err.message);
      console.log('App will still work for testing frontend features');
    });
} else {
  console.log('No MongoDB URI provided, running without database');
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Trust proxy for Render/Heroku (needed for secure cookies)
app.set('trust proxy', 1);

app.use(express.json());

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Only use MongoDB session store if MONGODB_URI is provided
// Only use MongoDB session store if connection succeeds
let mongoConnected = false;

if (process.env.MONGODB_URI) {
  try {
    sessionConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600 // lazy update session
    });
    mongoConnected = true;
  } catch (err) {
    console.warn('MongoStore creation failed, using memory store');
  }
}

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport');

// Analytics middleware (optional - only if MongoDB is connected)
if (process.env.MONGODB_URI && mongoConnected) {
  try {
    app.use(trackAnalytics({ 
      trackPageViews: true, 
      trackApiCalls: false 
    }));
  } catch (error) {
    console.warn('Failed to initialize analytics middleware:', error.message);
  }
}

// Routes
app.use('/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevFlow AI Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});