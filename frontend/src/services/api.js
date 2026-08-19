import axios from "axios";

const api = axios.create({
 baseURL: "https://cybereye-ai-backend.onrender.com",
  timeout: 30000,
});

export default api;
