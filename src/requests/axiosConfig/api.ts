import axios from "axios";
import { BASEURL } from "../../constant";

const api = axios.create({
  baseURL: `${BASEURL}`,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use();m 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
      }
      if (error.response.status === 500) {
        console.error("Server Error!");
      }
    }
    return Promise.reject(error);
  }
);

export default api;