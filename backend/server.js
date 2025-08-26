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
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport');

// Routes
app.use('/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevFlow AI Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});