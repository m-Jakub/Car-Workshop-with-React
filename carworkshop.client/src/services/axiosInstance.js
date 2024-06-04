import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7228/api',
    withCredentials: true,
});

export default axiosInstance;
