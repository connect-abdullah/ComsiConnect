import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaHeart, FaRetweet, FaBookmark, FaImage, FaTimes, FaRegHeart, FaRegBookmark, FaDownload } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { post, interaction, getPosts, getUser } from '../api/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Feed = () => {
  const [posts, setPosts] = useState();
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState();
  const [isPosting, setIsPosting] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(await getPosts());
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Handle text input change
  const handleContentChange = (e) => {
    setNewPostContent(e.target.value);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUser(await getUser());
    }
    fetchUser();
  }, []);

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file));
      setSelectedImages([...selectedImages, ...filesArray]);
      setPreviewImages([...previewImages, ...newPreviewImages]);
    }
  };

  // Handle remove image
  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedSelected = [...selectedImages];
    URL.revokeObjectURL(previewImages[index]);
    updatedPreviews.splice(index, 1);
    updatedSelected.splice(index, 1);
    setPreviewImages(updatedPreviews);
    setSelectedImages(updatedSelected);
  };

  // Handle post submission
  const handleSubmitPost = async () => {
    if (newPostContent.trim() === '' && selectedImages.length === 0) return;
    setIsPosting(true);
    const formData = new FormData();
    formData.append('content', newPostContent);
    selectedImages.forEach((file) => formData.append('images', file));
    try {
      const response = await post(formData);
      setPosts([response, ...posts]);
      setNewPostContent('');
      setSelectedImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
    setIsPosting(false);
  };

  // Handle post interactions (like, save, repost)
  const handlePostInteraction = async (postId, interactionType) => {
    try {
      const response = await interaction(postId, interactionType);
      setPosts(prevPosts => prevPosts.map(post => (post._id === postId ? response : post)));
    } catch (error) {
      console.error(`Failed to ${interactionType} post:`, error);
    }
  };

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

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Post Creation Section */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center">
              <img src={user?.avatar} alt={user?.fullName} className="w-full h-full object-cover rounded-full" />
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
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img src={src} alt="Preview" className="rounded-lg w-full h-36 object-cover"/>
                      <button onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 bg-zinc-900/70 rounded-full p-1 hover:bg-red-600/80 transition">
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-3">
                <button onClick={() => fileInputRef.current.click()} className="text-indigo-400 hover:text-indigo-300 transition p-2">
                  <FaImage size={18} />
                  <input type="file" ref={fileInputRef} onChange={handleImageSelect} multiple accept="image/*" className="hidden"/>
                </button>
                <button 
                  onClick={handleSubmitPost}
                  disabled={newPostContent.trim() === '' && previewImages.length === 0 || isPosting}
                  className={`px-4 py-2 rounded-md font-medium text-white transition ${
                    newPostContent.trim() === '' && previewImages.length === 0 
                      ? 'bg-indigo-600/50 cursor-not-allowed' 
                      : isPosting ? 'bg-indigo-600/70 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isPosting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feed Section */}
        <div className="space-y-6">
          {posts && posts.map(post => (
            <motion.div key={post._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
              {/* Post Header */}
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center">
                  <img src={post?.user?.avatar} alt={post?.user?.fullName} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post?.user?.fullName}</span>
                    <span className="text-zinc-400 text-sm">@{post?.user?.username}</span>
                  </div>
                  <span className="text-zinc-500 text-sm ">{dayjs(post?.createdAt).fromNow()}</span>
                </div>
              </div>
              
              {/* Post Content */}
              {post?.content && <p className="mb-4 text-zinc-200 whitespace-pre-wrap break-words">{post?.content}</p>}
              
              {/* Post Images */}
              {post?.images?.length > 0 && (
                <div className={`grid ${post?.images?.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4 mt-2 pt-3 border-t border-zinc-700`}>
                  {post?.images?.map((image, index) => (
                    <img key={index} src={image} alt={`Post image ${index + 1}`} onClick={() => setModalImage(image)}
                      className="rounded-lg w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"/>
                  ))}
                </div>
              )}
              
              {/* Post Actions */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700">
                {/* Like */}
                <motion.button whileTap={{scale:0.9}} onClick={() => handlePostInteraction(post?._id, 'like')} 
                  className="flex items-center gap-1 text-zinc-400 hover:text-red-500 transition">
                  <motion.div initial={false} animate={{scale:post?.isLiked?[1,1.2,1]:1, rotate:post?.isLiked?[0,15,-15,0]:0}} transition={{duration:0.5}}>
                    {post?.isLiked ? <FaHeart className="text-red-500"/> : <FaRegHeart/>}
                  </motion.div>
                  <motion.span animate={{scale:post?.isLiked?[1,1.2,1]:1}} className={post?.isLiked?"text-red-500":""}>
                    {post?.likedBy?.length}
                  </motion.span>
                </motion.button>

                {/* Repost */}
                <motion.button whileTap={{scale:0.9}} onClick={() => handlePostInteraction(post?._id, 'repost')}
                  className="flex items-center gap-1 text-zinc-400 hover:text-green-500 transition">
                  <motion.div animate={{rotate:post?.isReposted?360:0, scale:post?.isReposted?[1,1.2,1]:1}} transition={{duration:0.5}}>
                    <FaRetweet className={post?.isReposted?"text-green-500":""} />
                  </motion.div>
                  <motion.span animate={{scale:post?.isReposted?[1,1.2,1]:1}} className={post?.isReposted?"text-green-500":""}>
                    {post?.repostedBy?.length}
                  </motion.span>
                </motion.button>

                {/* Save */}
                <motion.button whileTap={{scale:0.9}} onClick={() => handlePostInteraction(post?._id, 'save')}
                  className={`text-${post?.isSaved?'indigo':'zinc'}-400 hover:text-indigo-400 transition`}>
                  <motion.div animate={{y:post?.isSaved?[0,-5,0]:0, scale:post?.isSaved?[1,1.2,1]:1}} transition={{duration:0.5}}>
                    {post?.isSaved?<FaBookmark/>:<FaRegBookmark/>}
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}}
            className="relative bg-zinc-900/95 rounded-xl shadow-2xl p-6 max-w-4xl w-full flex flex-col items-center border border-zinc-800">
            <button onClick={() => setModalImage(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors duration-200 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2">
              <FaTimes className="w-5 h-5"/>
            </button>
            <motion.img initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              src={modalImage} alt="Full size" className="max-h-[75vh] w-auto rounded-lg mb-6 shadow-xl" style={{objectFit:'contain'}}/>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => window.open(modalImage, '_blank')}
              className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors duration-200 shadow-lg">
              <FaDownload className="h-5 w-5"/>
              Download Image
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Feed