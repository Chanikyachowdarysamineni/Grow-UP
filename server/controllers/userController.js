const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio, avatar, skills, learningGoals } = req.body;

    let user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (user._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (skills) user.skills = skills;
    if (learningGoals) user.learningGoals = learningGoals;

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Award badge to user
exports.awardBadge = async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeId, badgeName, badgeIcon, badgeDescription } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if badge already exists
    const badgeExists = user.badges.some(badge => badge.id === badgeId);
    if (badgeExists) {
      return res.status(400).json({
        success: false,
        message: 'Badge already earned'
      });
    }

    // Add badge
    user.badges.push({
      id: badgeId,
      name: badgeName,
      icon: badgeIcon,
      description: badgeDescription,
      earnedDate: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Badge awarded successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
