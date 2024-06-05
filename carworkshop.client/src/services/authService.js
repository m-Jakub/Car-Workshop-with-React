import axiosInstance from "./axiosInstance";

const API_URL = "https://localhost:7228/api/auth";

export const login = async (username, password, rememberMe) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/login`, {
      username,
      password,
      rememberMe,
    });
    if (response.data.success) {
      localStorage.setItem("authStatus", JSON.stringify(true));
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userName", response.data.name);
      return { role: response.data.role, name: response.data.name };
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(`${API_URL}/logout`);
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authStatus");
};

export default { login, logout, isAuthenticated };
