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
      const response = await api.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const loginUser = async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const logoutUser = async () => {
    try {
      const response = await api.get('/users/logout');
      console.log("response from api js (logout) --> ",response);
      return response;
    } catch (error) {
      throw error;
    }
  };


// User Routes
  export const getUser = async () => {
    try {
      const response = await api.get('/users/profile');
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
      return response.data;
    } catch (error) {
      console.error('Update error details:', error.response?.data || error.message);
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
        // console.log("response from api js --> ",response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all posts api
export const getPosts = async () => {
    try {
        const response = await api.get('/feed/posts');
        // console.log("response from api js --> ",response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Interaction api
export const interaction = async (postId, interactionType) => {
    try {
        const response = await api.put(`/feed/post/${postId}`, { interactionType });
        return response.data;
    } catch (error) {
        throw error;
    }
};





// Profile Routes
// Get all posts for signed user
export const getUserPosts = async () => {
    try {
        const response = await api.get('/users/posts');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update a post
export const updatePost = async (postId, content) => {
  const response = await api.put(`/users/posts/${postId}`, content);
  return response.data;
};

// Delete a post
export const deletePost = async (postId) => {
  const response = await api.delete(`/users/posts/${postId}`);
  // console.log("response from api js (delete post) --> ",response);
  return response;
};






// Confessions Routes
// Get or create anonymous ID for the current user
export const getAnonymousID = async () => {
  try {
    const response = await api.get('/confessions/anonymous-id');
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all confessions
export const getConfessions = async () => {
  try {
    const response = await api.get('/confessions/all-posts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Interact with a confession (like, repost, save)
export const interactWithConfession = async (confessionId, interactionType) => {
  try {
    const response = await api.put(`/confessions/post/${confessionId}`, { interactionType });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all confessions for signed user
export const getMyConfessions = async () => {
  try {
    const response = await api.get('/confessions/my-posts');
    // console.log("response from api js --> ",response);  
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a confession
export const updateConfession = async (postId,content) => {
  try {
    const response = await api.put(`/confessions/my-posts/${postId}`, content);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a confession
export const deleteConfession = async (postId) => {
  try {
    const response = await api.delete(`/confessions/my-posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
