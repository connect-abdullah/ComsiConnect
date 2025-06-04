import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRetweet,
  FaBookmark,
  FaRegHeart,
  FaRegBookmark,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { interaction, viewProfile, followUser } from "../../api/api";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const ViewProfile = () => {
  const [userData, setUserData] = useState();
  const [posts, setPosts] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const response = await viewProfile(id);
        const userWithFollowStatus = {
          ...response?.user,
          isFollowed: response?.user?.followers?.length > 0
        };
        setUserData(userWithFollowStatus);
        setPosts(response?.posts);
        console.log("response --> ", response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleFollowUser = async (userId, action) => {
    if (!userId) return;

    try {
      const response = await followUser(userId, { action });

      if (response?.status === 200 || response?.status === 201) {
        const { isFollowed } = response.data;
        setUserData(prevUser => ({
          ...prevUser,
          isFollowed: isFollowed,
          followersCount: isFollowed ? prevUser.followersCount + 1 : prevUser.followersCount - 1
        }));
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const handlePostInteraction = async (postId, interactionType) => {
    try {
      const response = await interaction(postId, interactionType);
      setPosts(prevPosts =>
        prevPosts.map(post => (post._id === postId ? response : post))
      );
    } catch (error) {
      console.error(`Failed to ${interactionType} post:`, error);
    }
  };

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
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{userData?.fullName}</h1>
                  <p className="text-zinc-400 mb-1">@{userData?.username}</p>
                  <p className="text-zinc-400 mb-4 text-sm">Department: {userData?.department}</p>
                </div>
                <button
                  onClick={() => handleFollowUser(userData?._id, userData?.isFollowed ? "unfollow" : "follow")}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    userData?.isFollowed
                      ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {userData?.isFollowed ? "Following" : "Follow"}
                </button>
              </div>

              <p className="text-zinc-200 mb-6 font-bold">{userData?.bio}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  <div className="font-bold text-xl">
                    {userData?.postsCount}
                  </div>
                  <div className="text-zinc-400 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div onClick={() => navigate(`/profile/${userData?._id}/followers`)} className="font-bold text-xl hover:cursor-pointer">
                    {userData?.followersCount}
                  </div>
                  <div onClick={() => navigate(`/profile/${userData?._id}/followers`)} className="text-zinc-400 text-sm cursor-pointer hover:text-indigo-400">Followers</div>
                </div>
                <div className="text-center">
                  <div onClick={() => navigate(`/profile/${userData?._id}/following`)} className="font-bold text-xl hover:cursor-pointer">
                    {userData?.followingCount}
                  </div>
                  <div onClick={() => navigate(`/profile/${userData?._id}/following`)} className="text-zinc-400 text-sm cursor-pointer hover:text-indigo-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Gallery Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 ml-2">
            Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!posts || posts.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-zinc-800 rounded-xl border border-zinc-700">
                <FaBookmark className="mx-auto text-4xl text-zinc-600 mb-4" />
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                  No Posts Yet
                </h3>
                <p className="text-zinc-400">
                  This user hasn't made any posts
                </p>
              </div>
            ) : (
              posts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`relative flex flex-col bg-zinc-800 rounded-xl border border-zinc-700 shadow-lg ${post?.images?.length > 0 ? 'max-h-[500px] md:max-h-[600px] lg:max-h-[500px]' : 'max-h-fit'}`}
                  >
                    {/* Post Images Container - Only show if images exist */}
                    {post?.images?.length > 0 && (
                      <div className="h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden">
                        <div
                          className={`grid ${
                            post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                          } gap-1 p-3 h-full`}
                        >
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className={`flex flex-col flex-1 p-3 sm:p-4 ${post?.images?.length > 0 ? 'overflow-y-auto' : ''}`}>
                      {post?.content && (
                        <div className={post?.images?.length > 0 ? "flex-1 overflow-y-auto pb-3" : "pb-3"}>
                          <p className="text-zinc-200 whitespace-pre-wrap break-words">
                            {post?.content}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-zinc-400 pt-3 mt-auto border-t border-zinc-700">
                        <span>{dayjs(post?.createdAt).fromNow()}</span>
                        <div className="flex gap-2 sm:gap-4">
                          {/* Like Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
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
                          </motion.button>
                          {/* Repost Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePostInteraction(post._id, 'repost')}
                            className="flex items-center gap-1 hover:text-green-500 transition"
                          >
                            <FaRetweet />
                            <span>{post?.repostedBy?.length}</span>
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePostInteraction(post?._id, "save")}
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
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
