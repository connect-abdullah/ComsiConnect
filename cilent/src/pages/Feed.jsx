import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRetweet, FaBookmark, FaImage, FaTimes, FaRegHeart, FaRegBookmark } from 'react-icons/fa'
import Navbar from '../components/Navbar'

// Mock data for feed posts
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Ali Ahmed",
      username: "ali_ahmed",
      avatar: "AA"
    },
    content: "Just submitted my final year project at COMSATS today! The presentation went really well. #FYP #ComputerScience",
    timestamp: "2 hours ago",
    images: [],
    likes: 24,
    reposts: 5,
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    author: {
      name: "Sana Khan",
      username: "sana_khan",
      avatar: "SK"
    },
    content: "Check out the photos from yesterday's CS department event! Great to see so many talented students showcasing their work.",
    timestamp: "5 hours ago",
    images: ["https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvbXB1dGVyfGVufDB8fDB8fHww"],
    likes: 42,
    reposts: 8,
    isLiked: false,
    isSaved: false
  },
  {
    id: 3,
    author: {
      name: "Dr. Farooq Ahmed",
      username: "prof_farooq",
      avatar: "FA"
    },
    content: "Reminder: Project proposals for the spring semester are due next Friday. Make sure to submit them on time through the portal.",
    timestamp: "8 hours ago",
    images: [],
    likes: 15,
    reposts: 12,
    isLiked: false,
    isSaved: false
  },
  {
    id: 4,
    author: {
      name: "Maham Tariq",
      username: "maham_t",
      avatar: "MT"
    },
    content: "",
    timestamp: "1 day ago",
    images: [
      "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVuaXZlcnNpdHl8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVuaXZlcnNpdHl8ZW58MHx8MHx8fDA%3D"
    ],
    likes: 78,
    reposts: 10,
    isLiked: false,
    isSaved: false
  }
];

const Feed = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  // Handle text input change
  const handleContentChange = (e) => {
    setNewPostContent(e.target.value);
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Create preview URLs
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file));
      
      setSelectedImages([...selectedImages, ...filesArray]);
      setPreviewImages([...previewImages, ...newPreviewImages]);
    }
  };

  // Handle remove image
  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedSelected = [...selectedImages];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    updatedPreviews.splice(index, 1);
    updatedSelected.splice(index, 1);
    
    setPreviewImages(updatedPreviews);
    setSelectedImages(updatedSelected);
  };

  // Handle post submission
  const handleSubmitPost = () => {
    if (newPostContent.trim() === '' && previewImages.length === 0) return;
    
    const newPost = {
      id: Date.now(),
      author: {
        name: "Current User",
        username: "current_user",
        avatar: "CU"
      },
      content: newPostContent,
      timestamp: "Just now",
      images: previewImages,
      likes: 0,
      reposts: 0,
      isLiked: false,
      isSaved: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImages([]);
    setPreviewImages([]);
  };

  // Handle like toggle with animation
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handle save toggle
  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };

  // Handle repost
  const handleRepost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isReposted: !post.isReposted,
          reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Post Creation Section */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="font-medium text-sm">CU</span>
            </div>
            <div className="flex-grow">
              <textarea
                value={newPostContent}
                onChange={handleContentChange}
                placeholder="What's happening on campus?"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
              
              {/* Preview selected images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={src} 
                        alt="Preview" 
                        className="rounded-lg w-full h-36 object-cover"
                      />
                      <button 
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-zinc-900/70 rounded-full p-1 hover:bg-red-600/80 transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-3">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="text-indigo-400 hover:text-indigo-300 transition p-2"
                >
                  <FaImage size={18} />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </button>
                <button 
                  onClick={handleSubmitPost}
                  disabled={newPostContent.trim() === '' && previewImages.length === 0}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    newPostContent.trim() === '' && previewImages.length === 0 
                      ? 'bg-indigo-600/50 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feed Section */}
        <div className="space-y-6">
          {posts.map(post => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-800 rounded-xl border border-zinc-700 p-4"
            >
              {/* Post Header */}
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="font-medium text-sm">{post.author.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.author.name}</span>
                    <span className="text-zinc-400 text-sm">@{post.author.username}</span>
                  </div>
                  <span className="text-zinc-500 text-sm">{post.timestamp}</span>
                </div>
              </div>
              
              {/* Post Content */}
              {post.content && (
                <p className="mb-4 text-zinc-200">{post.content}</p>
              )}
              
              {/* Post Images */}
              {post.images.length > 0 && (
                <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4`}>
                  {post.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Post image ${index + 1}`} 
                      className="rounded-lg w-full h-auto max-h-80 object-cover"
                    />
                  ))}
                </div>
              )}
              
              {/* Post Actions */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700">
                {/* Like Button */}
                <div className="flex items-center">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-red-500 transition"
                  >
                    <AnimatePresence mode="wait">
                      {post.isLiked ? (
                        <motion.div
                          key="heart-filled"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <FaHeart className="text-red-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="heart-outline"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <FaRegHeart />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className={post.isLiked ? "text-red-500" : ""}>{post.likes}</span>
                  </motion.button>
                </div>
                
                {/* Repost Button */}
                <div className="flex items-center">
                  <button 
                    onClick={() => handleRepost(post.id)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-green-500 transition"
                  >
                    <FaRetweet />
                    <span>{post.reposts}</span>
                  </button>
                </div>
                
                {/* Save Button */}
                <div className="flex items-center">
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`flex items-center gap-1 ${post.isSaved ? 'text-indigo-400' : 'text-zinc-400 hover:text-indigo-400'} transition`}
                  >
                    {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feed