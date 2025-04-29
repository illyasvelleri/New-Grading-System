'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import UserHeader from '../../components/UserHeader'; // Adjust path as needed

export default function ProfileEdit() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    category: '',
    studentCount: 0,
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/profile', { withCredentials: true });
        setUser({
          username: response.data.username,
          email: response.data.email,
          password: '',
          category: response.data.category || '',
          studentCount: response.data.studentCount || 0,
          location: response.data.location || ''
        });
        setLoading(false);
      } catch (error) {
        setMessage('Error fetching user data: ' + (error.response?.data?.error || error.message));
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: name === 'studentCount' ? parseInt(value) || 0 : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setMessage('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!user.username.trim()) newErrors.username = 'Username is required';
    if (!user.email.trim()) newErrors.email = 'Email is required';
    else if (!/[^@]+@[^@]+\.[^@]+/.test(user.email)) newErrors.email = 'Invalid email format';
    if (user.password && user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (user.studentCount < 0) newErrors.studentCount = 'Student count cannot be negative';
    if (user.location && !user.location.startsWith('<iframe src="https://www.google.com/maps/embed')) {
      newErrors.location = 'Location must be a valid Google Maps embed iframe';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = { ...user };
      if (!payload.password) delete payload.password;
      await axios.put('/api/user/profile', payload, { withCredentials: true });
      setMessage('Profile updated successfully!');
      setErrors({});
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-tr from-blue-50 via-gray-50 to-white text-xs sm:text-sm text-gray-700 pb-36">
      <UserHeader />
      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          Edit Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 shadow-lg rounded-2xl p-4 sm:p-6 mb-8 transition-all hover:shadow-2xl max-w-2xl mx-auto"
        >
          {message && (
            <p
              className={`text-center mb-4 ${
                message.includes('Error') ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </p>
          )}

          {/* Username */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter username"
              aria-label="Username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email"
              aria-label="Email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              New Password (optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter new password"
              aria-label="New password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={user.category || ''}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Category"
            >
              <option value="">Select category</option>
              <option value="below-20">Below 20</option>
              <option value="below-50">Below 50</option>
              <option value="above-50">Above 50</option>
            </select>
          </div>

          {/* Student Count */}
          <div className="mb-6">
            <label htmlFor="studentCount" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              Student Count
            </label>
            <input
              type="number"
              id="studentCount"
              name="studentCount"
              value={user.studentCount}
              onChange={handleChange}
              min="0"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter student count"
              aria-label="Student count"
            />
            {errors.studentCount && <p className="text-red-500 text-xs mt-1">{errors.studentCount}</p>}
          </div>

          {/* Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-gray-700 text-xs sm:text-sm font-medium mb-2">
              Location (Google Maps Embed)
            </label>
            <textarea
              id="location"
              name="location"
              value={user.location || ''}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
              placeholder='Paste Google Maps iframe, e.g., <iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
              rows="4"
              aria-label="Google Maps embed iframe"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-bold text-sm sm:text-base bg-gradient-to-r from-blue-500 to-green-500 hover:bg-green-600 transition-all hover:scale-105"
              aria-label="Save profile changes"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}