import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { getList, followUser } from '../../api/api';
import Navbar from '../../components/Navbar';

const FollowList = () => {
  const navigate = useNavigate();
  const { type, userId } = useParams();
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await getList(userId);
      console.log("response --> ", response);
      setUserData(response.user);

      if (type === 'followers') {
        const followersWithStatus = response.user.followers.map(user => ({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
          isFollowed: response.user.following.some(u => u._id === user._id)
        }));
        setUsers(followersWithStatus);
      } else {
        const followingWithStatus = response.user.following.map(user => ({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          avatar: user.avatar,
          isFollowed: true
        }));
        setUsers(followingWithStatus);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const handleFollowUser = async (userId, action) => {
    if (!userId) return;

    try {
      const response = await followUser(userId, { action });

      if (response.status === 200 || response.status === 201) {
        const { isFollowed } = response.data;

        setUsers(prevUsers =>
          prevUsers.map(user => {
            if (user._id === userId) {
              return {
                ...user,
                isFollowed: isFollowed
              };
            }
            return user;
          })
        );
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full hover:bg-zinc-700 transition"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-2xl font-bold capitalize">
              {type}
            </h1>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-12 bg-zinc-800 rounded-xl border border-zinc-700">
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                No {type} yet
              </h3>
              <p className="text-zinc-400">
                Users who {type === 'followers' ? 'follow you' : 'you follow'} will appear here
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div 
                key={user._id} 
                className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition"
              >
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate(`/view-profile/${user._id}`)}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-xl">
                        {user.fullName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="ml-4">
                    <h2 className="font-bold text-lg text-white">{user.fullName}</h2>
                    <p className="text-zinc-400 text-sm">@{user.username}</p>
                  </div>
                </div>

                {/* Follow Button */}
                {userData && userData._id !== user._id && (
                  <button
                    onClick={() => handleFollowUser(user._id, user.isFollowed ? "unfollow" : "follow")}
                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                      user.isFollowed
                        ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {user.isFollowed ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
