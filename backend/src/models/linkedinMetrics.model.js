const mongoose = require('mongoose');

const linkedinMetricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  followers: {
    total: {
      type: Number,
      default: 0
    },
    growthRate: {
      type: Number,
      default: 0
    },
    recentFollowers: {
      type: Number,
      default: 0
    },
    demographics: {
      industries: [
        {
          name: String,
          percentage: Number
        }
      ],
      locations: [
        {
          name: String,
          percentage: Number
        }
      ]
    }
  },
  connections: {
    total: {
      type: Number,
      default: 0
    },
    growthRate: {
      type: Number,
      default: 0
    },
    recentConnections: {
      type: Number,
      default: 0
    }
  },
  posts: {
    total: {
      type: Number,
      default: 0
    },
    engagement: {
      totalLikes: {
        type: Number,
        default: 0
      },
      totalComments: {
        type: Number,
        default: 0
      },
      totalShares: {
        type: Number,
        default: 0
      },
      averageLikesPerPost: {
        type: Number,
        default: 0
      },
      averageCommentsPerPost: {
        type: Number,
        default: 0
      },
      averageSharesPerPost: {
        type: Number,
        default: 0
      }
    }
  },
  engagement: {
    overallRate: {
      type: Number,
      default: 0
    },
    byType: {
      likes: {
        count: {
          type: Number,
          default: 0
        },
        percentage: {
          type: Number,
          default: 0
        }
      },
      comments: {
        count: {
          type: Number,
          default: 0
        },
        percentage: {
          type: Number,
          default: 0
        }
      },
      shares: {
        count: {
          type: Number,
          default: 0
        },
        percentage: {
          type: Number,
          default: 0
        }
      }
    },
    trend: [
      {
        date: String,
        rate: Number
      }
    ],
    topContent: [
      {
        id: String,
        engagement: Number,
        engagementRate: Number
      }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const LinkedInMetrics = mongoose.model('LinkedInMetrics', linkedinMetricsSchema);

module.exports = LinkedInMetrics;
