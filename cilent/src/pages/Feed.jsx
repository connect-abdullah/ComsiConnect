import { useState, useRef, useEffect  } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaHeart, FaRetweet, FaBookmark, FaImage, FaTimes, FaRegHeart, FaRegBookmark, FaDownload, FaSearch, FaComment, FaTrash } from "react-icons/fa"
import Navbar from "../components/Navbar"
import { post, interaction, getPosts, followUser, getComments, addComment, deleteComment, getAllUsers } from "../api/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

const Feed = () => {
  const [posts, setPosts] = useState()
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedImages, setSelectedImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)
  const [user, setUser] = useState()
  const [allUsers, setAllUsers] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [modalImage, setModalImage] = useState(null)
  const [followedStatus, setFollowedStatus] = useState({})
  const [followingPosts, setFollowingPosts] = useState([])
  const [showFollowing, setShowFollowing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showComments, setShowComments] = useState(null)
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState("")
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [visibleComments, setVisibleComments] = useState({}) // Track number of visible comments per post
  const COMMENTS_PER_PAGE = 3 // Initial comments to show
  const COMMENTS_INCREMENT = 4 // Additional comments to load
  const navigate = useNavigate()


  useEffect(() => {
    const fetchAllData = async () => {
      const response = await getAllUsers()
      setUser(response.currentUser)
      setAllUsers(response.users)

      // Now fetch posts, since you have user info
      const postsResponse = await getPosts()
      
      // Process posts to include reposts as separate entries
      let allPosts = []
      postsResponse?.posts?.forEach(post => {
        // Add original post
        allPosts.push(post)
        
        // Add reposted versions as separate posts, excluding current user's reposts
        if (post.repostedBy && post.repostedBy.length > 0) {
          post.repostedBy.forEach(reposter => {
            // Only add repost if it's not from the current user
            if (reposter._id !== user?._id) {
              const repost = {
                ...post,
                _id: `${post._id}-repost-${reposter._id}`, // Unique ID for repost
                repostedByUser: reposter
              }
              // Insert repost at random position
              const randomIndex = Math.floor(Math.random() * (allPosts.length + 1))
              allPosts.splice(randomIndex, 0, repost)
            }
          })
        }
      })

      setPosts(allPosts)
      setFollowingPosts(postsResponse?.followingPosts)
      setLoading(false)
    }
    fetchAllData()
  }, [])

// Update the handleSearchChange function to search through all users
const handleSearchChange = (e) => {
  const query = e.target.value
  setSearchQuery(query)

  // Debounce the search filtering
  const timeoutId = setTimeout(() => {
    if (query.trim()) {
      const filteredUsers = allUsers.filter(user => 
        user?.fullName?.toLowerCase().includes(query.toLowerCase()) || 
        user?.username?.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredUsers || [])
    } else {
      setSearchResults([])
    }
  }, 500)

  return () => clearTimeout(timeoutId)
}
  // Handle text input change
  const handleContentChange = (e) => {
    setNewPostContent(e.target.value)
  }

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const newPreviewImages = filesArray.map((file) => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...filesArray])
      setPreviewImages([...previewImages, ...newPreviewImages])
    }
  }

    // Fetch comments for a post
    const fetchComments = async (postId) => {
      try {
        const response = await getComments(postId)
        setComments(prev => ({
          ...prev,
          [postId]: response
        }))
        // Initialize visible comments count
        setVisibleComments(prev => ({
          ...prev,
          [postId]: COMMENTS_PER_PAGE
        }))
      } catch (error) {
        console.error("Failed to fetch comments:", error)
      }
    }
  
    // Handle comment submission
    const handleSubmitComment = async (postId) => {
      if (!newComment.trim()) return
      
      setIsPostingComment(true)
      try {
        const response = await addComment(postId, { content: newComment })
        setComments(prev => ({
          ...prev,
          [postId]: response
        }))
        // Update visible comments if needed
        setVisibleComments(prev => ({
          ...prev,
          [postId]: Math.max(prev[postId] || COMMENTS_PER_PAGE, response.length)
        }))
        // Update post comment count in the posts state
        setPosts(prev => prev.map(post => {
          if (post._id.split('-repost-')[0] === postId) {
            return {
              ...post,
              comments: response
            }
          }
          return post
        }))
        setNewComment("")
      } catch (error) {
        console.error("Failed to post comment:", error)
      }
      setIsPostingComment(false)
    }
  
    // Handle comment deletion
    const handleDeleteComment = async (postId, commentId) => {
      try {
        await deleteComment(postId, commentId)
        // Remove comment from state
        const updatedComments = comments[postId].filter(comment => comment._id !== commentId)
        setComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }))
        // Update visible comments count if needed
        setVisibleComments(prev => ({
          ...prev,
          [postId]: Math.min(prev[postId], updatedComments.length)
        }))
        // Update post comment count in the posts state
        setPosts(prev => prev.map(post => {
          if (post._id.split('-repost-')[0] === postId) {
            return {
              ...post,
              comments: updatedComments
            }
          }
          return post
        }))
      } catch (error) {
        console.error("Failed to delete comment:", error)
      }
    }
  
    // Handle loading more comments
    const handleLoadMoreComments = (postId) => {
      setVisibleComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || COMMENTS_PER_PAGE) + COMMENTS_INCREMENT
      }))
    }
  
    // Handle comment section toggle
    const handleCommentClick = async (postId) => {
      if (showComments === postId) {
        setShowComments(null)
      } else {
        setShowComments(postId)
        if (!comments[postId]) {
          await fetchComments(postId)
        }
      }
    }
  

  // Handle remove image
  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages]
    const updatedSelected = [...selectedImages]
    URL.revokeObjectURL(previewImages[index])
    updatedPreviews.splice(index, 1)
    updatedSelected.splice(index, 1)
    setPreviewImages(updatedPreviews)
    setSelectedImages(updatedSelected)
  }

  // Handle post submission
  const handleSubmitPost = async () => {
    if (newPostContent.trim() === "" && selectedImages.length === 0) return
    setIsPosting(true)
    const formData = new FormData()
    formData.append("content", newPostContent)
    selectedImages.forEach((file) => formData.append("images", file))
    try {
      const response = await post(formData)
      setPosts([response, ...posts])
      setNewPostContent("")
      setSelectedImages([])
      setPreviewImages([])
    } catch (error) {
      console.error("Failed to create post:", error)
    }
    setIsPosting(false)
  }

  // Handle post interactions (like, save, repost)
  const handlePostInteraction = async (postId, interactionType) => {
    try {
      const response = await interaction(postId, interactionType)
      
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          // Handle original post update
          if (post._id === postId) {
            const updatedPost = {
              ...response,
              user: {
                ...response?.user,
                isFollowed: post?.user?.isFollowed
              }
            }
            return updatedPost
          }
          
          // Handle repost updates
          if (post._id.startsWith(`${postId}-repost-`)) {
            return {
              ...post,
              isLiked: response?.isLiked,
              likedBy: response?.likedBy,
              isReposted: response?.isReposted,
              repostedBy: response?.repostedBy,
              isSaved: response?.isSaved
            }
          }
          
          return post
        }).filter(post => {
          // Remove repost if user undid their repost
          if (interactionType === 'repost' && !response.isReposted) {
            return !post._id.includes(`${postId}-repost-${user._id}`)
          }
          return true
        })
      })
      
    } catch (error) {
      console.error(`Failed to ${interactionType} post:`, error)
    }
  }

  // Handle follow user
  const handleFollowUser = async (userId, action) => {
    if (!userId) return

    try {
      // Make API call to follow/unfollow user
      const response = await followUser(userId, { action })
      // console.log("Follow response:", response)

      if (response.status === 200 || response.status === 201) {
        const { isFollowed } = response.data

        // Update posts to reflect the new follow status
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.user?._id === userId) {
              return {
                ...post,
                user: {
                  ...post.user,
                  isFollowed: isFollowed,
                },
              }
            }
            return post
          }),
        )
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error)
    }
  }

  // User Profile Section
  const handleViewProfile = async (id) => {
    navigate(`/view-profile/${id}`)
  }
  
  useEffect(() => {
    if (posts && posts.length > 0) {
      const initialStatus = {}
      posts.forEach((post) => {
        if (post?.user && post?.user?._id) {
          initialStatus[post?.user?._id] = post?.user?.isFollowed || false
        }
      })
      setFollowedStatus(initialStatus)
    }
  }, [posts])

  if (loading) {
    return (
      <div className="bg-zinc-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading feed...</p>
        </div>
      </div>
    )
  }

  const displayPosts = showFollowing ? followingPosts : posts;

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Search and Toggle Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && searchQuery && (
              <div className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg">
                {searchResults.map((user) => (
                  <div
                    key={user?._id}
                    onClick={() => {
                      handleViewProfile(user?._id)
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-700 cursor-pointer transition"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{user?.fullName}</div>
                      <div className="text-sm text-zinc-400">@{user?.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setShowFollowing(!showFollowing)}
            className={`px-4 py-2 rounded-full transition-all ml-4 ${
              showFollowing 
                ? "bg-indigo-600 text-white text-sm max-[375px]:text-xs" 
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm max-[375px]:text-xs"
            }`}
          >
            {showFollowing ? "Show All Posts" : "Show Following"}
          </button>
        </div>

        {/* Post Creation Section */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center">
              <img
                src={user?.avatar || "/placeholder.svg"}
                alt={user?.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-grow">
              <textarea
                value={newPostContent}
                onChange={handleContentChange}
                placeholder="What's happening on campus?"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white whitespace-pre-wrap break-words"
              />

              {/* Preview selected images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src || "/placeholder.svg"}
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
                  disabled={(newPostContent.trim() === "" && previewImages.length === 0) || isPosting}
                  className={`px-4 py-2 rounded-md font-medium text-white transition ${
                    newPostContent.trim() === "" && previewImages.length === 0
                      ? "bg-indigo-600/50 cursor-not-allowed"
                      : isPosting
                        ? "bg-indigo-600/70 cursor-wait"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isPosting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          {displayPosts &&
            displayPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-800 rounded-xl border border-zinc-700 p-3 sm:p-4"
              >
                {/* Post Header */}
                {post?.repostedByUser && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-[#38383f] rounded-lg p-2 w-full mb-4">
                    <FaRetweet className="text-green-400 text-xs sm:text-sm" />
                    <span className="text-xs sm:text-sm">
                      Reposted by <span className="font-bold text-[#b3bbb6] cursor-pointer hover:text-indigo-400" onClick={() => handleViewProfile(post?.repostedByUser?._id)}>@{post?.repostedByUser?.username}</span>
                    </span>
                  </div>
                )}

                <div className={`flex gap-2 sm:gap-3 mb-3`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={post?.user?.avatar ||"/placeholder.svg"}
                      alt={post?.user?.fullName}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleViewProfile(post?.user?._id)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2 mb-1 sm:mb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs sm:text-base truncate cursor-pointer max-[338px]:text-[0.7rem]" onClick={() => handleViewProfile(post?.user?._id)}>{post?.user?.fullName}</span>
                            <span className="text-zinc-400 text-xs max-[338px]:text-[0.5rem]">@{post?.user?.username}</span>
                          </div>
                          <span className="hidden sm:block text-zinc-500 text-xs sm:text-sm">{dayjs(post?.createdAt).fromNow()}</span>
                        </div>
                         {/* Follow button (mobile only) */}
                        {post?.user?._id !== user?._id && (
                          <button
                            onClick={() => handleFollowUser(post?.user?._id, post?.user?.isFollowed ? "unfollow" : "follow")}
                            className={`sm:hidden text-xs px-3 py-1 rounded-full transition-all ${
                              post?.user?.isFollowed
                                ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                          >
                            {post?.user?.isFollowed ? "Following" : "Follow"}
                          </button>
                        )}
                      </div>
                      {/* Follow button (desktop only) */}
                      {post?.user?._id !== user?._id && (
                        <button
                          onClick={() => handleFollowUser(post?.user?._id, post?.user?.isFollowed ? "unfollow" : "follow")}
                          className={`hidden sm:block text-xs px-3 py-1 rounded-full transition-all ${
                            post?.user?.isFollowed
                              ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {post?.user?.isFollowed ? "Following" : "Follow"}
                        </button>
                      )}
                    </div>
                    <span className="block sm:hidden text-zinc-500 text-xs max-[338px]:text-[10px]">{dayjs(post?.createdAt).fromNow()}</span>
                  </div>
                </div>

                {/* Post Content */}
                {post?.content && (
                  <p className="mb-4 text-zinc-200 text-sm sm:text-base whitespace-pre-wrap break-words">
                    {post?.content}
                  </p>
                )}

                {/* Post Images */}
                {post?.images?.length > 0 && (
                  <div
                    className={`grid ${post?.images?.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-2 mb-4 mt-2 pt-3 border-t border-zinc-700`}
                  >
                    {post?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Post image ${index + 1}`}
                        onClick={() => setModalImage(image)}
                        className="rounded-lg w-full h-auto max-h-60 sm:max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700">
                  {/* Like */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePostInteraction(post?._id.split('-repost-')[0], "like")}
                    className="flex items-center gap-1 text-zinc-400 hover:text-red-500 transition"
                  >
                    <motion.div
                      initial={false}
                      animate={{ scale: post?.isLiked ? [1, 1.2, 1] : 1, rotate: post?.isLiked ? [0, 15, -15, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {post?.isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </motion.div>
                    <motion.span
                      animate={{ scale: post?.isLiked ? [1, 1.2, 1] : 1 }}
                      className={post?.isLiked ? "text-red-500" : ""}
                    >
                      {post?.likedBy?.length}
                    </motion.span>
                  </motion.button>

                  {/* Comment */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCommentClick(post?._id.split('-repost-')[0])}
                    className="flex items-center gap-1 text-zinc-400 hover:text-blue-500 transition"
                  >
                    <FaComment className={showComments === post?._id.split('-repost-')[0] ? "text-blue-500" : ""} />
                    <span className={showComments === post?._id.split('-repost-')[0] ? "text-blue-500" : ""}>
                      {post?.comments?.length || 0}
                    </span>
                  </motion.button>

                  {/* Repost */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePostInteraction(post?._id.split('-repost-')[0], "repost")}
                    className="flex items-center gap-1 text-zinc-400 hover:text-green-500 transition"
                  >
                    <motion.div
                      animate={{ rotate: post?.isReposted ? 360 : 0, scale: post?.isReposted ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaRetweet className={post?.isReposted ? "text-green-500" : ""} />
                    </motion.div>
                    <motion.span
                      animate={{ scale: post?.isReposted ? [1, 1.2, 1] : 1 }}
                      className={post?.isReposted ? "text-green-500" : ""}
                    >
                      {post?.repostedBy?.length}
                    </motion.span>
                  </motion.button>

                  {/* Save */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePostInteraction(post?._id.split('-repost-')[0], "save")}
                    className={`text-${post?.isSaved ? "indigo" : "zinc"}-400 hover:text-indigo-400 transition`}
                  >
                    <motion.div
                      animate={{ y: post?.isSaved ? [0, -5, 0] : 0, scale: post?.isSaved ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {post?.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </motion.div>
                  </motion.button>
                </div>

                {/* Comments Section */}
                {showComments === post?._id.split('-repost-')[0] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 border-t border-zinc-700 pt-4"
                  >
                    {/* Comment Input */}
                    <div className="flex gap-2 mb-4">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex-shrink-0">
                        <img
                          src={user?.avatar || "/placeholder.svg"}
                          alt={user?.fullName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitComment(post?._id.split('-repost-')[0])}
                        disabled={!newComment.trim() || isPostingComment}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white transition ${
                          !newComment.trim() || isPostingComment
                            ? "bg-indigo-600/50 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {isPostingComment ? "..." : "Post"}
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments[post?._id.split('-repost-')[0]]?.slice(0, visibleComments[post?._id.split('-repost-')[0]] || COMMENTS_PER_PAGE)
                        .map((comment) => (
                        <motion.div 
                          key={comment?._id} 
                          className="flex gap-3 hover:bg-zinc-800/50 p-2 rounded-lg transition-colors duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-7 h-7 bg-indigo-600 rounded-full flex-shrink-0 ring-2 ring-indigo-500/20">
                            <img
                              src={comment?.user?.avatar || "/placeholder.svg"}
                              alt={comment?.user?.fullName}
                              className="w-7 h-7 object-cover rounded-full cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleViewProfile(comment?.user?._id)}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <span 
                                className="font-semibold text-sm cursor-pointer hover:text-indigo-400 transition-colors" 
                                onClick={() => handleViewProfile(comment?.user?._id)}
                              >
                                {comment?.user?.fullName}
                              </span>
                              <span className="text-zinc-400 text-xs font-medium">@{comment?.user?.username}</span>
                              <span className="text-zinc-500 text-xs">{dayjs(comment?.createdAt).fromNow()}</span>
                              {comment?.user?._id === user?._id && (
                                <button
                                  onClick={() => handleDeleteComment(post?._id.split('-repost-')[0], comment?._id)}
                                  className="text-red-500 text-xs hover:text-red-600 transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                            <div className="bg-zinc-700/50 rounded-lg p-3 mt-2 break-words max-w-full overflow-hidden">
                              <p className="text-sm text-zinc-100 whitespace-pre-wrap break-all">{comment?.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Show More Comments Button */}
                      {comments[post?._id.split('-repost-')[0]]?.length > (visibleComments[post?._id.split('-repost-')[0]] || COMMENTS_PER_PAGE) && (
                        <button
                          onClick={() => handleLoadMoreComments(post?._id.split('-repost-')[0])}
                          className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors bg-zinc-700/30 rounded-lg mt-4"
                        >
                          Show More Comments
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
        </div>
      </div>

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-zinc-900/95 rounded-xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full flex flex-col items-center border border-zinc-800"
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-zinc-400 hover:text-white transition-colors duration-200 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              src={modalImage}
              alt="Full size"
              className="max-h-[60vh] sm:max-h-[75vh] w-auto rounded-lg mb-4 sm:mb-6 shadow-xl"
              style={{ objectFit: "contain" }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(modalImage, "_blank")}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors duration-200 shadow-lg text-sm sm:text-base"
            >
              <FaDownload className="h-4 w-4 sm:h-5 sm:w-5" />
              Download Image
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Feed