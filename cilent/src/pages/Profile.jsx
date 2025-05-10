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
import Navbar from "../components/Navbar";
import { logoutUser, getUser } from "../api/api";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUser();
        // console.log(response);
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);


  // Mock user data
  //   const [userData, setUserData] = useState({
  //     username: "farhan_ahmed",
  //     displayName: "Farhan Ahmed",
  //     avatar: "FA",
  //     bio: "Computer Science student at COMSATS University | Web Developer | AI Enthusiast",
  //     postsCount: 24,
  //     followersCount: 186,
  //     followingCount: 112,
  //     posts: [
  //       {
  //         id: 1,
  //         content: "Just finished my frontend project using React and Tailwind CSS. Learning a lot at COMSATS!",
  //         timestamp: "2 days ago",
  //         images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXIlMjBwcm9ncmFtbWluZ3xlbnwwfHwwfHx8MA%3D%3D"],
  //         likes: 32,
  //         reposts: 4,
  //         isLiked: false,
  //         isSaved: false
  //       },
  //     ]
  //   });

  // View state for gallery (grid or list)
  const [viewMode, setViewMode] = useState("grid");

  // Handle like toggle with animation
  const handleLike = (postId) => {
    setUserData((prevData) => {
      const updatedPosts = prevData.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      });

      return {
        ...prevData,
        posts: updatedPosts,
      };
    });
  };

  // Handle save toggle
  const handleSave = (postId) => {
    setUserData((prevData) => {
      const updatedPosts = prevData.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved,
          };
        }
        return post;
      });

      return {
        ...prevData,
        posts: updatedPosts,
      };
    });
  };

  // Handle repost
  const handleRepost = (postId) => {
    setUserData((prevData) => {
      const updatedPosts = prevData?.posts?.map((post) => {
        if (post?.id === postId) {
          return {
            ...post,
            reposts: post?.reposts + 1,
          };
        }
        return post;
      });

      return {
        ...prevData,
        posts: updatedPosts,
      };
    });
  };
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Posts</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded ${
                viewMode === "grid" ? "bg-indigo-600" : "bg-zinc-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded ${
                viewMode === "list" ? "bg-indigo-600" : "bg-zinc-700"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Post Gallery Section */}
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData?.posts?.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden"
              >
                {/* Post Images (If Any) */}
                {post?.images?.length > 0 && (
                  <div
                    className={`grid ${
                      post?.images?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    } gap-1`}
                  >
                    {post?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4">
                  {post?.content && (
                    <p className="mb-3 text-zinc-200 line-clamp-3">
                      {post?.content}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-sm text-zinc-400">
                    <span>{post?.timestamp}</span>

                    <div className="flex gap-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition"
                      >
                        {post?.isLiked ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span className={post?.isLiked ? "text-red-500" : ""}>
                          {post?.likes}
                        </span>
                      </button>

                      {/* Repost Button */}
                      <button
                        onClick={() => handleRepost(post.id)}
                        className="flex items-center gap-1 hover:text-green-500 transition"
                      >
                        <FaRetweet />
                        <span>{post?.reposts}</span>
                      </button>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSave(post.id)}
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
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {userData?.posts?.map((post) => (
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
                    <span className="font-medium text-sm">
                      {userData?.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{userData?.fullName}</span>
                      <span className="text-zinc-400 text-sm">
                        @{userData?.username}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-sm">
                      {post?.timestamp}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                {post?.content && (
                  <p className="mb-4 text-zinc-200">{post?.content}</p>
                )}

                {/* Post Images */}
                {post?.images?.length > 0 && (
                  <div
                    className={`grid ${
                      post?.images?.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    } gap-2 mb-4`}
                  >
                    {post?.images?.map((image, index) => (
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
                        {post?.isLiked ? (
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
                      <span className={post?.isLiked ? "text-red-500" : ""}>
                        {post?.likes}
                      </span>
                    </motion.button>
                  </div>

                  {/* Repost Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleRepost(post?.id)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-green-500 transition"
                    >
                      <FaRetweet />
                      <span>{post?.reposts}</span>
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleSave(post?.id)}
                      className={`flex items-center gap-1 ${
                        post?.isSaved
                          ? "text-indigo-400"
                          : "text-zinc-400 hover:text-indigo-400"
                      } transition`}
                    >
                      {post?.isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
