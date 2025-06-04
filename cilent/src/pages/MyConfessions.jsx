import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRetweet, FaBookmark, FaEdit, FaTimes, FaRegHeart, FaRegBookmark, FaUser } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { getMyConfessions, updateConfession, deleteConfession } from '../api/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const MyConfessions = () => {
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState({ open: false, confession: null })
  const [editContent, setEditContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch user's confessions
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await getMyConfessions()
        setConfessions(response)
      } catch (error) {
        console.error('Error fetching confessions:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchConfessions()
  }, [])

  // Edit confession handler
  const handleEditClick = (confession) => {
    setEditModal({ open: true, confession })
    setEditContent(confession.content)
  }

  const handleEditSave = async () => {
    setIsEditing(true)
    try {
      const updated = await updateConfession(editModal.confession._id, { content: editContent })
      setConfessions(prev =>
        prev.map(c => (c._id === updated._id ? updated : c))
      )
      setEditModal({ open: false, confession: null })
    } catch (err) {
      console.error('Failed to update confession:', err)
    } finally {
      setIsEditing(false)
    }
  }

  // Delete confession handler
  const handleDelete = async (confessionId) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) return
    setIsDeleting(true)
    try {
      await deleteConfession(confessionId)
      setConfessions(prev => prev.filter(c => c._id !== confessionId))
    } catch (err) {
      console.error('Failed to delete confession:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Function to get initials from anonymous ID
  const getInitials = (anonId) => {
    return anonId ? anonId.substring(0, 2).toUpperCase() : 'AN'
  }

  // Generate background color based on anonymous ID
  const getColorFromId = (id) => {
    const colors = [
      'bg-purple-600', 'bg-blue-600', 'bg-green-600', 
      'bg-yellow-600', 'bg-red-600', 'bg-pink-600',
      'bg-indigo-600', 'bg-teal-600'
    ]
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
          <p>Loading your confessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 border border-zinc-700">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">My Confessions</h1>
            <Link 
              to="/confessions" 
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition flex items-center gap-2"
            >
              All Confessions <span className="text-lg">→</span>
            </Link>
          </div>
          <p className="text-zinc-400 mt-2">View and manage your anonymous confessions</p>
        </div>

        {/* Confessions Feed */}
        <div className="space-y-6">
          {confessions.length === 0 ? (
            <div className="text-center py-12 bg-zinc-800 rounded-xl border border-zinc-700">
              <FaUser className="mx-auto text-4xl text-zinc-600 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">No Confessions Yet</h3>
              <p className="text-zinc-400">Start sharing your thoughts anonymously</p>
              <Link 
                to="/confessions"
                className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition"
              >
                Create Confession
              </Link>
            </div>
          ) : (confessions &&
            confessions.map(confession => (
              <motion.div 
                key={confession._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 relative"
              >
                {/* Edit/Delete Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={() => handleEditClick(confession)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white shadow transition"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(confession._id)}
                    className="px-2.5 bg-red-600 hover:bg-red-700 rounded-full text-white shadow transition"
                    title="Delete"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                    ) : (
                      <span className="font-bold text-lg leading-none">&times;</span>
                    )}
                  </button>
                </div>

                {/* Confession Header */}
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
                  <p className="mb-4 text-zinc-200 whitespace-pre-wrap break-words">{confession.content}</p>
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

                {/* Confession Interactions Display */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700">
                  <div className="flex items-center gap-1 text-zinc-400">
                    <FaHeart className={confession.isLiked ? "text-red-500" : ""} />
                    <span>{confession.likedBy?.length || 0}</span>
                  </div>

                  <div className="text-zinc-400">
                    <FaBookmark className={confession.isSaved ? "text-indigo-400" : ""} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-lg border border-zinc-700 shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                onClick={() => setEditModal({ open: false, confession: null })}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Confession</h2>
              <textarea
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white mb-4"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditModal({ open: false, confession: null })}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isEditing}
                  className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold ${
                    isEditing ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {isEditing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyConfessions