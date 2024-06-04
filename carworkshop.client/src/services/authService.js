import axiosInstance from './axiosInstance';

const API_URL = 'https://localhost:7228/api/auth';

export const login = async (username, password, rememberMe) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/login`, { username, password, rememberMe });
    if (response.data.success) {
      return { role: response.data.role, name: response.data.name };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(`${API_URL}/logout`);
    console.log('Logged out');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
