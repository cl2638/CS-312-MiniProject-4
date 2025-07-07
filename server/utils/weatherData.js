// grabbing axios so i can make http requests easily
const axios = require("axios");

// setting up the base url and my secret key for the openuv api
const openuv = {
  BASE_URL: "https://api.openuv.io/api/v1",
  SECRET_KEY: "openuv-7c1arrmc462oom-io"
};

// This function sends a GET request to OpenUV with coordinates
// response is returned to server route
const getUVData = async (lat, lng) => {
  try {
    const response = await axios.get(`${openuv.BASE_URL}/uv`, {
      headers: { "x-access-token": openuv.SECRET_KEY },
      params: { lat, lng }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching UV data:", error.response?.data || error.message);
    throw new Error("Failed to get UV data");
  }
};

module.exports = getUVData;