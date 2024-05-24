import axios from 'axios';

const API_URL = '/api/auth/';

export const login = async (username, password, rememberMe) => {
    try {
        const response = await axios.post(`${API_URL}login`, {
            username,
            password,   
            rememberMe
        }, { withCredentials: true });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await axios.post(`${API_URL}logout`, {}, { withCredentials: true });
    } catch (error) {
        throw error;
    }
};
