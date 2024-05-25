// authService.js
import axios from 'axios';

const API_URL = 'https://localhost:7228/api/Auth';

export const login = async (username, password, rememberMe) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password, rememberMe }, { withCredentials: true });
    if (response.data.success) {
      return response.data.role;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};
