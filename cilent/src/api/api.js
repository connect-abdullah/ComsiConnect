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
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
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
  