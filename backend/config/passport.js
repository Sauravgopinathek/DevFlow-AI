const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Ensure environment variables are loaded
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Build callback URL - use BACKEND_URL in production, relative path in development
const callbackURL = process.env.BACKEND_URL 
    ? `${process.env.BACKEND_URL}/auth/github/callback`
    : "/auth/github/callback";

// ✅ OPEN ACCESS POLICY: Any GitHub user can sign in without approval
// - No whitelist restrictions
// - All users are auto-approved upon first sign-in
// - No manual approval process required
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const githubUsername = profile.username;
        
        // Check if user already exists with this GitHub ID (returning user)
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
            // Update existing user's access token and info
            user.githubAccessToken = accessToken;
            user.username = githubUsername;
            user.displayName = profile.displayName || githubUsername;
            user.email = email || user.email;
            user.avatarUrl = profile.photos?.[0]?.value;
            await user.save();
            return done(null, user);
        }

        // ✅ OPEN SOURCE: All GitHub users auto-approved immediately
        // No whitelist, no manual approval process - accessible worldwide
        user = new User({
            githubId: profile.id,
            username: githubUsername,
            displayName: profile.displayName || githubUsername,
            email: email || `${githubUsername}@github.local`,
            avatarUrl: profile.photos?.[0]?.value,
            githubAccessToken: accessToken,
            authProvider: 'github',
            // Auto-approve all users - no manual intervention needed
            isRegistered: true,
            registrationStatus: 'approved',
            registeredAt: new Date(),
            approvedAt: new Date()
        });

        await user.save();
        console.log(`✅ Auto-created user: ${githubUsername} (${email || 'no email'})`);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});



passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});