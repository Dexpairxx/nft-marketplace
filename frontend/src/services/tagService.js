import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchTags = async() => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tag`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  } 