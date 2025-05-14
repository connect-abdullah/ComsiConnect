import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRetweet,
  FaBookmark,
  FaEdit,
  FaRegHeart,
  FaRegBookmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { logoutUser, getUser, getUserPosts, interaction, updatePost, deletePost } from "../../api/api";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [posts, setPosts] = useState();
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getUserPosts();
        console.log("response from profile jsx (fetch user posts) --> ", response.data);
        setPosts(response.data.posts);
        setSavedPosts(response.data.savedPosts || []); // Store saved posts separately
        console.log("savedPosts --> ", response.data.savedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostInteraction = async (postId, interactionType) => {
    try {
      const response = await interaction(postId, interactionType);
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? response : post))
      );
      
      // Update saved posts if the interaction was a save
      if (interactionType === 'save') {
        const updatedPost = response;
        if (updatedPost.isSaved) {
          setSavedPosts(prev => [...prev, updatedPost]);
        } else {
          setSavedPosts(prev => prev.filter(post => post._id !== postId));
        }
      }
    } catch (error) {
      console.error(`Failed to ${interactionType} post:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      let response = await logoutUser();
      if (response.status === 200) {
        navigate("/login");
      } else {
        console.error("Logout failed:", response);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Edit post handler
  const handleEditClick = (post) => {
    setEditModal({ open: true, post });
    setEditContent(post.content);
  };

  const handleEditSave = async () => {
    setIsEditing(true);
    try {
      const updated = await updatePost(editModal.post._id, { content: editContent });
      setPosts(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
      );
      setEditModal({ open: false, post: null });
    } catch (err) {
      console.error('Failed to update post:', err);
    } finally {
      setIsEditing(false);
    }
  };

  // Delete post handler
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      const response = await deletePost(postId);
      let data = response.data.user[0];
      if(response.status === 200){
        setPosts(prev => prev.filter(p => p._id !== postId));
        setSavedPosts(prev => prev.filter(p => p._id !== postId));
        setUserData(data);
      } else {
        console.error('Failed to delete post:', response);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get the posts to display based on showSavedPosts toggle
  const displayPosts = showSavedPosts ? savedPosts : posts;

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Section */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center"
            >
              {userData?.avatar ? (
                <img 
                  src={userData?.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-bold text-3xl">
                  {userData?.fullName?.charAt(0)}
                </span>
              )}
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{userData?.fullName}</h1>
              <p className="text-zinc-400 mb-1">@{userData?.username}</p>
              <p className="text-zinc-400 mb-4 text-sm">Department: {userData?.department}</p>

              <p className="text-zinc-200 mb-6 font-bold">{userData?.bio}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {userData?.postsCount}
                  </div>
                  <div className="text-zinc-400 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {userData?.followersCount}
                  </div>
                  <div className="text-zinc-400 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {userData?.followingCount}
                  </div>
                  <div className="text-zinc-400 text-sm">Following</div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="flex gap-4">
                <Link
                  to="/edit-profile"
                  state={{ user: userData }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center gap-2 mx-auto md:mx-0"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2 mx-auto md:mx-0"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Gallery Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold">
            {showSavedPosts ? "Saved Posts" : "Posts"}
          </h2>
          <button
            onClick={() => setShowSavedPosts(!showSavedPosts)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors w-full sm:w-auto justify-center sm:justify-start ${
              showSavedPosts 
                ? "bg-indigo-600 hover:bg-indigo-700" 
                : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            <FaBookmark className={showSavedPosts ? "text-white" : "text-zinc-400"} />
            <span>{showSavedPosts ? "Show All Posts" : "Show Saved Posts"}</span>
          </button>
        </div>

        {/* Post Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPosts && displayPosts.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-zinc-800 rounded-xl border border-zinc-700">
              <FaBookmark className="mx-auto text-4xl text-zinc-600 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                {showSavedPosts ? "No Saved Posts" : "No Posts"}
              </h3>
              <p className="text-zinc-400">
                {showSavedPosts 
                  ? "Posts you save will appear here" 
                  : "Start creating posts to see them here"}
              </p>
            </div>
          ) : (
            displayPosts && displayPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`relative flex flex-col bg-zinc-800 rounded-xl border border-zinc-700 shadow-lg ${post?.images?.length > 0 ? 'max-h-[500px] md:max-h-[600px] lg:max-h-[500px]' : 'max-h-fit'}`}
                >
                  {/* Edit/Delete Buttons - Only show on user's own posts */}
                  {!showSavedPosts && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white shadow transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post?._id)}
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
                  )}

                  {/* Post Images Container - Only show if images exist */}
                  {post?.images?.length > 0 ? (
                    <div className="h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden">
                      <div
                        className={`grid ${
                          post?.images?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        } gap-1 p-3 h-full`}
                      >
                        {post?.images?.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Post Content */}
                  <div className={`flex flex-col flex-1 p-3 sm:p-4 ${post?.images?.length > 0 ? 'overflow-y-auto' : ''}`}>
                    {showSavedPosts && (
                      <div className="mb-2">
                        <span className="text-indigo-400 font-semibold">@{post?.user?.username}</span>
                      </div>
                    )}
                    {post?.content && (
                      <div className={post?.images?.length > 0 ? "flex-1 overflow-y-auto" : "pb-5"}>
                        <p className="text-zinc-200 whitespace-pre-wrap break-words">
                          {post?.content}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-zinc-400 pt-3 mt-auto border-t border-zinc-700">
                      <span>{dayjs(post?.createdAt).fromNow()}</span>
                      <div className="flex gap-2 sm:gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handlePostInteraction(post._id, 'like')}
                          className="flex items-center gap-1 hover:text-red-500 transition"
                        >
                          {post?.isLiked ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span className={post?.isLiked ? "text-red-500" : ""}>
                            {post?.likedBy?.length}
                          </span>
                        </button>
                        {/* Repost Button */}
                        <button
                          onClick={() => handlePostInteraction(post._id, 'repost')}
                          className="flex items-center gap-1 hover:text-green-500 transition"
                        >
                          <FaRetweet />
                          <span>{post?.repostedBy?.length }</span>
                        </button>
                        {/* Save Button */}
                        <button
                          onClick={() => handlePostInteraction(post._id, 'save')}
                          className={
                            post.isSaved
                              ? "text-indigo-400"
                              : "hover:text-indigo-400 transition"
                          }
                        >
                          {post?.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-zinc-800 rounded-xl p-4 sm:p-6 w-full max-w-lg border border-zinc-700 shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                onClick={() => setEditModal({ open: false, post: null })}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Post</h2>
              <textarea
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white mb-4"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditModal({ open: false, post: null })}
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
  );
};

export default Profile;
