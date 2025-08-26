const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Registration info
  isRegistered: {
    type: Boolean,
    default: false
  },
  registrationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  registeredAt: {
    type: Date
  },
  approvedAt: {
    type: Date
  },
  // Primary identifiers - optional until OAuth linking
  githubId: {
    type: String,
    sparse: true,
    unique: true
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  // User info
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.githubId; // Password required only if not using GitHub OAuth
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  avatarUrl: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    maxlength: 100
  },
  website: {
    type: String,
    maxlength: 200
  },
  // Auth provider info (set during OAuth)
  authProvider: {
    type: String,
    enum: ['github'],
    default: 'github'
  },
  githubAccessToken: {
    type: String
  },
  // Google Calendar integration
  googleTokens: {
    accessToken: String,
    refreshToken: String,
    expiryDate: Date,
    scope: String
  },
  // Notion Integration
  notionAccessToken: {
    type: String,
    select: false
  },
  notionWorkspaceId: {
    type: String,
    select: false
  },
  notionWorkspaceName: {
    type: String
  },
  notionWorkspaceIcon: {
    type: String
  },
  notionBotId: {
    type: String,
    select: false
  },
  // Trello Integration
  trelloApiKey: {
    type: String,
    select: false
  },
  trelloToken: {
    type: String,
    select: false
  },
  trelloUsername: {
    type: String
  },
  // Slack Integration
  slackAccessToken: {
    type: String,
    select: false
  },
  slackTeamId: {
    type: String,
    select: false
  },
  slackTeamName: {
    type: String
  },
  slackUserId: {
    type: String,
    select: false
  },
  slackChannelId: {
    type: String
  },
  slackChannelName: {
    type: String
  },
  // User settings
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: false
      }
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'dark'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      language: {
        type: String,
        default: 'en'
      },
      autoSync: {
        type: Boolean,
        default: true
      }
    }
  },
  // Workflow preferences (legacy - keeping for backward compatibility)
  preferences: {
    autoSync: {
      type: Boolean,
      default: true
    },
    syncInterval: {
      type: Number,
      default: 30 // minutes
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);