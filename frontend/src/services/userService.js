import axios from "axios";

const API_BASE_URL = "";

export const fetchUserProfile = async (account) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user/address/${account}`);
    return {
      avatarUrl: response.data.avatar_url,
      coverUrl: response.data.cover_url,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchUserTransaction = async (account) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user/address/${account}/transaction`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
