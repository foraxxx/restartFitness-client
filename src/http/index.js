import axios from "axios"
import {API_URL, AUTH_ROUTE} from "../utils/consts.js"

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  // headers: {
  //   'Content-Type': 'application/json'
  // }
})

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false

$api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const accessToken = localStorage.getItem('token');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing &&
      accessToken // Если токен есть, только тогда пытаемся обновить
    ) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await axios.get(`${API_URL}/user/refresh`, {
          withCredentials: true
        });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        $api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        return $api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        window.location.href = AUTH_ROUTE;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default $api