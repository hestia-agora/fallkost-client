import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:5000'
    : 'https://web-production-744e.up.railway.app');

export const runModel = async (params) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/`,
      params,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("Error running model:", error.message || error);
    throw error;
  }
};
