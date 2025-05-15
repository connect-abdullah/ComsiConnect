import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

// User authentication API calls
export const signupUser = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Signup failed - Please try again');
      }
      throw error;
    }
  };
  
  export const loginUser = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw error;
    }
  };

  export const logoutUser = async () => {
    try {
      const response = await api.get('/auth/logout');
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const forgotPass = async (credentials) => {
    try {
      const response = await api.post('/auth/forgot', credentials);
      // console.log("Response From forgot api -->", response)

      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('OTP Delivery Failed - Please try again');
      }
      throw error;
    }
  };

  export const verifyOTP = async (data) => {
    try {
      const response = await api.post('/auth/verify-otp',data);
      // console.log("Response From verfiy api -->", response)
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('OTP Expired - Please try again');
      }
      throw error;
    }
  };


// User Routes
  export const getUser = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const updateUser = async (formData) => {
    try {
      // Log what's being sent
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
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
    } catch (error) {
      console.error('Update error details:', error.response?.data || error.message);
      throw error;
    }
  };

  export const viewProfile = async (id) => {
    try {
      const response = await api.get(`/users/view-profile/${id}`);
      // console.log("response of view profile api --> ", response)
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getList = async (id) => {
    try {
      const response = await api.get(`/users/profile/${id}`);
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      // console.log("response of get followers api --> ", response.data)
      return response.data;
    } catch (error) { 
      throw error;
    }
  };




// Feed Routes
// Feed Api
export const post = async (postData) => { 
    try {
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
    } catch (error) {
        throw error;
    }
};

// Get all posts api
export const getPosts = async () => {
    try {
        const response = await api.get('/feed/posts');
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Interaction api
export const interaction = async (postId, interactionType) => {
    try {
        const response = await api.put(`/feed/post/${postId}`, { interactionType });
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Follow User
export const followUser = async (userId, action) => {
  try {
    // console.log(action)
    const response = await api.post(`/feed/follow/${userId}`, action);
    
    // console.log("Response from followUser api -->" , response)
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    throw error;
  }
};






// Profile Routes
// Get all posts for signed user
export const getUserPosts = async () => {
    try {
        const response = await api.get('/users/posts');
        // console.log("response --> ", response)
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

// Update a post
export const updatePost = async (postId, content) => {
  try {
    const response = await api.put(`/users/posts/${postId}`, content);
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/users/posts/${postId}`);
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response;
  } catch (error) {
    throw error;
  }
};





// Confessions Routes
// Get or create anonymous ID for the current user
export const getAnonymousID = async () => {
  try {
    const response = await api.get('/confessions/anonymous-id');
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post a new confession
export const postConfession = async (formData) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

// Get all confessions
export const getConfessions = async () => {
  try {
    const response = await api.get('/confessions/all-posts');
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Interact with a confession (like, repost, save)
export const interactWithConfession = async (confessionId, interactionType) => {
  try {
    const response = await api.put(`/confessions/post/${confessionId}`, { interactionType });
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all confessions for signed user
export const getMyConfessions = async () => {
  try {
    const response = await api.get('/confessions/my-posts');
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a confession
export const updateConfession = async (postId,content) => {
  try {
    const response = await api.put(`/confessions/my-posts/${postId}`, content);
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;  
  }
};

// Delete a confession
export const deleteConfession = async (postId) => {
  try {
    const response = await api.delete(`/confessions/my-posts/${postId}`);
    if (response.status === 401) {
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Chatbot Api
export const chatbot = async (message) => {
  try {
    const response = await fetch(`${API_URL}/users/chat`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message })
    });
    return response;
  } catch (error) {
    throw error;
  }
};