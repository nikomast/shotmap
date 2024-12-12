import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

export const fetchClickHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clickHistory`);
    if (!response.ok) {
      throw new Error("Failed to fetch click history");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching click history:", error);
    return [];
  }
};


const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const registerUser = (data) => API.post('accounts/register/', data);
export const loginUser = (data) => API.post('token/', data);