import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadi-forum-backend-dg95.onrender.com/api",
});

export default axiosBase;
