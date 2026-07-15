import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role && ['admin', 'developer', 'user'].includes(role) ? role : 'user'
    });

    // Return user details (without password)
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user (explicitly request password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Return user details
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ message: 'Server error during account deletion.' });
  }
};

