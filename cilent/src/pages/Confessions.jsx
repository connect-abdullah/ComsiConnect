import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRetweet, FaBookmark, FaImage, FaTimes, FaRegHeart, FaRegBookmark, FaUser } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { getAnonymousID, postConfession, getConfessions, interactWithConfession } from '../api/api'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const Confessions = () => {
  const [confessions, setConfessions] = useState([])
  const [newConfessionContent, setNewConfessionContent] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [anonymousID, setAnonymousID] = useState('')
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  // Fetch anonymous ID and confessions
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get or create anonymous ID for current user
        const anonymousData = await getAnonymousID()
        setAnonymousID(anonymousData.anonymousID)
        
        // Fetch confessions
        const confessionsData = await getConfessions()
        setConfessions(confessionsData)
        console.log("confessionsData from confessions js --> ", confessionsData);
      } catch (error) {
        console.error('Error initializing confession page:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initialize()
  }, [])

  // Handle text input change
  const handleContentChange = (e) => {
    setNewConfessionContent(e.target.value)
  }

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      
      // Create preview URLs
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file))
      
      setSelectedImages([...selectedImages, ...filesArray])
      setPreviewImages([...previewImages, ...newPreviewImages])
    }
  }

  // Handle remove image
  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages]
    const updatedSelected = [...selectedImages]
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index])
    
    updatedPreviews.splice(index, 1)
    updatedSelected.splice(index, 1)
    
    setPreviewImages(updatedPreviews)
    setSelectedImages(updatedSelected)
  }

  // Handle confession submission
  const handleSubmitConfession = async () => {
    if (newConfessionContent.trim() === '' && selectedImages.length === 0) return
    setIsPosting(true)

    try {
      // Prepare FormData for image upload
      const formData = new FormData()
      formData.append('content', newConfessionContent)
      
      // Append each image file
      selectedImages.forEach((file) => {
        formData.append('images', file)
      })
      
      // Add the anonymous ID
      formData.append('anonymousID', anonymousID)
      
      // Submit confession
      const response = await postConfession(formData)
      
      // Update UI with new confession
      setConfessions([response, ...confessions])
      
      // Clear the form
      setNewConfessionContent('')
      setSelectedImages([])
      setPreviewImages([])
    } catch (error) {
      console.error('Failed to post confession:', error)
    } finally {
      setIsPosting(false)
    }
  }

  // Handle confession interactions (like, save, repost)
  const handleConfessionInteraction = async (confessionId, interactionType) => {
    try {
      const response = await interactWithConfession(confessionId, interactionType)
      
      setConfessions(prevConfessions =>
        prevConfessions.map(confession => 
          confession._id === confessionId ? response : confession
        )
      )
    } catch (error) {
      console.error(`Failed to ${interactionType} confession:`, error)
    }
  }

  // Function to get initials from anonymous ID
  const getInitials = (anonId) => {
    return anonId ? anonId.substring(0, 2).toUpperCase() : 'AN'
  }

  // Generate background color based on anonymous ID (for consistent colors)
  const getColorFromId = (id) => {
    const colors = [
      'bg-purple-600', 'bg-blue-600', 'bg-green-600', 
      'bg-yellow-600', 'bg-red-600', 'bg-pink-600',
      'bg-indigo-600', 'bg-teal-600'
    ]
    
    // Use a hash function to get a consistent color for each ID
    let hash = 0
    for (let i = 0; i < id?.length || 0; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading confessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Header with Explanation */}
        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
          <h1 className="text-xl font-bold mb-2">COMSATS Confessions</h1>
          <p className="text-zinc-400">Share your thoughts anonymously. Your hidden identity is <span className="text-indigo-400 font-mono">{anonymousID}</span></p>
        </div>
        
        {/* Confession Creation Section */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 mb-8">
          <div className="flex gap-3">
            <div className={`w-10 h-10 ${getColorFromId(anonymousID)} rounded-full flex-shrink-0 flex items-center justify-center`}>
              <span className="font-medium text-sm">{getInitials(anonymousID)}</span>
            </div>
            <div className="flex-grow">
              <textarea
                value={newConfessionContent}
                onChange={handleContentChange}
                placeholder="Share your anonymous confession..."
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
                  onClick={handleSubmitConfession}
                  disabled={newConfessionContent.trim() === '' && previewImages.length === 0 || isPosting}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    newConfessionContent.trim() === '' && previewImages.length === 0 
                      ? 'bg-indigo-600/50 cursor-not-allowed' 
                      : isPosting
                        ? 'bg-indigo-600/70 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isPosting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    'Post Anonymously'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Confessions Feed */}
        <div className="space-y-6">
          {confessions.map(confession => (
            <motion.div 
              key={confession._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-800 rounded-xl border border-zinc-700 p-4"
            >
              {/* Confession Header (with anonymous ID) */}
              <div className="flex gap-3 mb-3">
                <div className={`w-10 h-10 ${getColorFromId(confession.anonymousID)} rounded-full flex-shrink-0 flex items-center justify-center`}>
                  <span className="font-medium text-sm">{getInitials(confession.anonymousID)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-300">{confession.anonymousID}</span>
                  </div>
                  <span className="text-zinc-500 text-sm">{dayjs(confession.createdAt).fromNow()}</span>
                </div>
              </div>
              
              {/* Confession Content */}
              {confession.content && (
                <p className="mb-4 text-zinc-200">{confession.content}</p>
              )}
              
              {/* Confession Images */}
              {confession.images?.length > 0 && (
                <div className={`grid ${confession.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4`}>
                  {confession.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Confession image ${index + 1}`} 
                      className="rounded-lg w-full h-auto max-h-80 object-cover"
                    />
                  ))}
                </div>
              )}
              
              {/* Confession Actions */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700">
                {/* Like */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleConfessionInteraction(confession._id, 'like')}
                  className="flex items-center gap-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: confession.isLiked ? [1, 1.2, 1] : 1,
                      rotate: confession.isLiked ? [0, 15, -15, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {confession.isLiked ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </motion.div>
                  <motion.span
                    animate={{ scale: confession.isLiked ? [1, 1.2, 1] : 1 }}
                    className={confession.isLiked ? "text-red-500" : ""}
                  >
                    {confession.likedBy?.length || 0}
                  </motion.span>
                </motion.button>

                {/* Repost */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleConfessionInteraction(confession._id, 'repost')}
                  className="flex items-center gap-1 text-zinc-400 hover:text-green-500 transition"
                >
                  <motion.div
                    animate={{ 
                      rotate: confession.isReposted ? 360 : 0,
                      scale: confession.isReposted ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaRetweet className={confession.isReposted ? "text-green-500" : ""} />
                  </motion.div>
                  <motion.span
                    animate={{ scale: confession.isReposted ? [1, 1.2, 1] : 1 }}
                    className={confession.isReposted ? "text-green-500" : ""}
                  >
                    {confession.repostedBy?.length || 0}
                  </motion.span>
                </motion.button>

                {/* Save */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleConfessionInteraction(confession._id, 'save')}
                  className={`text-${confession.isSaved ? 'indigo' : 'zinc'}-400 hover:text-indigo-400 transition`}
                >
                  <motion.div
                    animate={{ 
                      y: confession.isSaved ? [0, -5, 0] : 0,
                      scale: confession.isSaved ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {confession.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Confessions