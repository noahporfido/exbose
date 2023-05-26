import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    "Content-type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
    body: `client_credentials&client_id=${
      import.meta.env.VITE_CLIENT_ID
    }&client_secret=${import.meta.env.VITE_CLIENT_SECRET}`,
  },
});

export default apiClient;
