import React, { useState, useRef, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import { FaCamera, FaArrowLeft, FaTimes } from 'react-icons/fa'
import Navbar from '../../components/Navbar';
import { updateUser } from '../../api/api';


const EditProfile = () => {

  const location = useLocation();
  const {user} = location?.state || {};
  // console.log("user --> ",user);
  

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    avatar: "",
    bio: "",
    email: "",
    department: "",
    yearOfStudy: ""
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user?.username,
        fullName: user?.fullName,
        avatar: user?.avatar,
        bio: user?.bio,
        email: user?.email,
        department: user?.department,
        yearOfStudy: user?.yearOfStudy
      });
      // console.log("User loaded:", user);
    }
  }, [user]);
  
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle avatar selection
  const handleAvatarSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatar(file);
      
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setPreviewAvatar(previewURL);
    }
  };
  
  // Handle removing avatar
  const handleRemoveAvatar = () => {
    if (previewAvatar) {
      URL.revokeObjectURL(previewAvatar);
    }
    setNewAvatar(null);
    setPreviewAvatar(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const data = new FormData();
  
      // Append all form fields
      for (const key in formData) {
        data.append(key, formData[key]);
      }
  
      // Append the new avatar file (if selected)
      if (newAvatar) {
        data.append('file', newAvatar);
      }
  
      const response = await updateUser(data); 
      // console.log('Profile updated:', response);
  
      setSaveSuccess(true);
  
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };
  
  
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar with Feed Links */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <a 
            href="/profile" 
            className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition"
          >
            <FaArrowLeft />
          </a>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
          {/* Avatar Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                {previewAvatar || formData?.avatar ? (
                  <img 
                    src={previewAvatar || formData?.avatar}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-3xl">
                    {formData?.fullName?.slice(0,2)}
                  </span>
                )}
              </div>
              
              {/* Avatar Upload Button */}
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition"
              >
                <FaCamera />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                  accept="image/*"
                  className="hidden"
                />
              </button>
              
              {/* Remove Avatar Button */}
              {previewAvatar && (
                <button 
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute top-0 right-0 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <p className="text-zinc-400 text-sm">Click the camera icon to change your profile picture</p>
          </div>
          
          {/* Basic Info Section */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold border-b border-zinc-700 pb-2">Basic Information</h2>
            
            {/* Display Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData?.fullName}
                onChange={handleChange}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                Username
              </label>
              <div className="flex items-center">
                <span className="bg-zinc-700 border border-r-0 border-zinc-600 rounded-l-md px-3 py-3 text-zinc-400">@</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData?.username}
                  onChange={handleChange}
                  className="flex-1 bg-zinc-700 border border-zinc-600 rounded-r-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-zinc-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData?.bio}
                onChange={handleChange}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>
          
          {/* Academic Info Section */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold border-b border-zinc-700 pb-2">Academic Information</h2>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-zinc-300 mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData?.department}
                onChange={handleChange}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
            </div>
            
            {/* Year of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-zinc-300 mb-2">
                Year of Study
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData?.yearOfStudy}
                onChange={handleChange}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <a 
              href="/profile" 
              className="w-full sm:w-auto text-center px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-md transition"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md transition ${
                saving ? 'bg-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
          
          {/* Success Message */}
          {saveSuccess && (
            <div className="mt-4 p-3 bg-green-600/20 border border-green-500 rounded-md text-green-200 text-center">
              Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default EditProfile