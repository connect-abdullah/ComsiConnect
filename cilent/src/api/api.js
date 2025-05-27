import axios from 'axios';

const API_URL = "http://localhost:3000"; // /api 

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

// User authentication API calls
export const signupUser = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.response?.status === 401) {
    throw new Error('Signup failed - Please try again');
  }
  return response;
};
  
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // console.log("Login response --> ", response.data);
  if (response.response?.status === 401) {
    throw new Error('Invalid username or password');
  }
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get('/auth/logout');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response;
};

export const forgotPass = async (credentials) => {
  const response = await api.post('/auth/forgot', credentials);
  if (response.response?.status === 401) {
    throw new Error('OTP Delivery Failed - Please try again');
  }
  return response;
};

export const verifyOTP = async (data) => {
  const response = await api.post('/auth/verify-otp',data);
  if (response.response?.status === 401) {
    throw new Error('OTP Expired - Please try again');
  }
  return response;
};

// User Routes
export const getUser = async () => {
  const response = await api.get('/users/profile');
  // console.log("Get user response --> ", response.data);

  return response.data;
};

export const updateUser = async (formData) => {
  const response = await api.put('/users/profile/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

export const viewProfile = async (id) => {
  const response = await api.get(`/users/view-profile/${id}`);
  return response.data;
};

export const getList = async (id) => {
  const response = await api.get(`/users/profile/${id}`);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Feed Routes
// Feed Api
export const post = async (postData) => {
  const response = await api.post('/feed/post', postData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Get all posts api
export const getPosts = async () => {
  const response = await api.get('/feed/posts');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/feed/users');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Interaction api
export const interaction = async (postId, interactionType) => {
  const response = await api.put(`/feed/post/${postId}`, { interactionType });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Follow User
export const followUser = async (userId, action) => {
  const response = await api.post(`/feed/follow/${userId}`, action);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response;
};

// Add comment to post
export const addComment = async (postId, content) => {
  const response = await api.post(`/feed/post/${postId}/comment`, content);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Get comments for a post
export const getComments = async (postId) => {
  const response = await api.get(`/feed/post/${postId}/comments`);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  const response = await api.delete(`/feed/post/${postId}/comment/${commentId}`);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Profile Routes
// Get all posts for signed user
export const getUserPosts = async () => {
  const response = await api.get('/users/posts');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response;
};

// Update a post
export const updatePost = async (postId, content) => {
  const response = await api.put(`/users/posts/${postId}`, content);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Delete a post
export const deletePost = async (postId) => {
  const response = await api.delete(`/users/posts/${postId}`);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response;
};

// Confessions Routes
// Get or create anonymous ID for the current user
export const getAnonymousID = async () => {
  const response = await api.get('/confessions/anonymous-id');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Post a new confession
export const postConfession = async (formData) => {
  const response = await api.post('/confessions/post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Get all confessions
export const getConfessions = async () => {
  const response = await api.get('/confessions/all-posts');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Interact with a confession (like, repost, save)
export const interactWithConfession = async (confessionId, interactionType) => {
  const response = await api.put(`/confessions/post/${confessionId}`, { interactionType });
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Get all confessions for signed user
export const getMyConfessions = async () => {
  const response = await api.get('/confessions/my-posts');
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Update a confession
export const updateConfession = async (postId,content) => {
  const response = await api.put(`/confessions/my-posts/${postId}`, content);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Delete a confession
export const deleteConfession = async (postId) => {
  const response = await api.delete(`/confessions/my-posts/${postId}`);
  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return response.data;
};

// Chatbot Api
export const chatbot = async (message) => {
  const response = await fetch(`api/users/chat`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message })
  });
  return response;
};