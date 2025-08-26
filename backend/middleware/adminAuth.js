// Simple admin authentication middleware
const adminEmails = [
  'your-email@gmail.com', // Replace with your actual email
  'saurav@example.com',   // Your current test email
  // Add more admin emails here
];

const adminUsernames = [
  'Sauravgopinathek',     // Your GitHub username
  // Add more admin usernames here
];

const requireAdmin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user is admin by email or username
  const isAdminByEmail = adminEmails.includes(req.user.email);
  const isAdminByUsername = adminUsernames.includes(req.user.username);

  if (!isAdminByEmail && !isAdminByUsername) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = { requireAdmin };