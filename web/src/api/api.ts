import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// AccessToken stay in memory
// Reduce XSS attack exposition
// Need to get refresh token when reload pages (lose access token)
let accessToken: string | null = null;

let isRefreshing = false;

let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  // Need this to send cookies httpOnly to backend
  withCredentials: true,
});

// Before each request, add Authorization header case exists accessToken
api.interceptors.request.use((config): any => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Case request fail with 401, try refresh to get access token and refresh token
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: Boolean;
    };

    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      //   if already has refresh executing, add the new requests to queue - avoid run more than 1 refresh at same time
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh");

        const newAccessToken = response.data.accessToken;

        setAccessToken(newAccessToken);

        failedRequestsQueue.forEach((request) => {
          request.resolve(newAccessToken);
        });

        failedRequestsQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);

        failedRequestsQueue.forEach((request) => {
          request.reject(refreshError);
        });

        failedRequestsQueue = [];

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
