import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';
import User from '../../../models/User'; // Adjust path
import db from '../../../lib/db'; // Adjust path

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  await db();

  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = decoded.userId;

  if (req.method === 'GET') {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { username, email, password, category, studentCount, location } = req.body;

      // Validate required fields
      if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }

      // Check email uniqueness (excluding current user)
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }

      // Validate and sanitize location (iframe)
      let sanitizedLocation = location || undefined;
      if (location) {
        if (!location.startsWith('<iframe src="https://www.google.com/maps/embed')) {
          return res.status(400).json({ error: 'Location must be a valid Google Maps embed iframe' });
        }
        sanitizedLocation = sanitizeHtml(location, {
          allowedTags: ['iframe'],
          allowedAttributes: {
            iframe: ['src', 'width', 'height', 'style', 'allowfullscreen', 'loading', 'referrerpolicy']
          },
          allowedIframeHostnames: ['www.google.com']
        });
        if (!sanitizedLocation || sanitizedLocation === location.trim()) {
          return res.status(400).json({ error: 'Invalid iframe content' });
        }
      }

      // Prepare update data
      const updateData = {
        username,
        email,
        category: category || undefined,
        studentCount: studentCount >= 0 ? studentCount : 0,
        location: sanitizedLocation
      };

      // Hash password if provided
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Update user
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}