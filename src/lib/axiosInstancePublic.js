import axios from 'axios';

const axiosInstancePublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "https://bluapi.aas.technology",
  headers: {
    'Content-Type': 'application/json'
  },

});

export default axiosInstancePublic;




