import User from '../models/User.js';

export const getRecentActivity = async (req, res) => {
  try {
    // For now, we'll just fetch the most recently created users
    // as "Recent User Activity" since we don't have an activity log table
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt role');

    const activity = recentUsers.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      action: 'Registered an account',
      timestamp: user.createdAt
    }));

    return res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return res.status(500).json({ message: 'Server error while fetching activity.' });
  }
};
