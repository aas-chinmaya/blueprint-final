import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://bluapi.aas.technology/api",
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, 
});

export default axiosInstance;

