import axios, { AxiosError, HttpStatusCode } from 'axios';
import qs from 'query-string';
import { __DEV__ } from 'src/utils';
import { appCookies } from 'src/utils/cookies';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: null,
  paramsSerializer: { serialize: (params) => qs.stringify(params) },
  proxy: {
    host: 'http://localhost',
    port: 3001,
  },
});
let isRefreshing = false;
let failedQueue: { resolve; reject }[] = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = appCookies.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      if (!config.baseURL) {
        const tokenData = appCookies.getDecodedAccessToken();
        const workspace = tokenData.domain.split('.')[0];
        if (!location.hostname.includes(workspace) && !__DEV__) {
          appCookies.clearAll();
          window.location.href = __DEV__
            ? 'http://localhost:8000/verify'
            : process.env.REACT_APP_REDIRECT_URL;
        }
        const baseURL = `http://api.${workspace}.funiverse.world`;
        axiosClient.defaults.baseURL = baseURL;
        config.baseURL = baseURL;
      }
    }
    return config;
  },
  (error) => {},
);
axiosClient.interceptors.response.use(
  (response) => {
    isRefreshing = false;
    if (failedQueue.length > 0) {
      const token = appCookies.getAccessToken();
      processQueue(null, token);
    }
    return response?.data;
  },
  (error: AxiosError) => {
    switch (error.response.status) {
      case 401:
        return handle401Error(error);
      default:
        return Promise.reject(error);
    }
  },
);

export default axiosClient;

async function handle401Error(error: AxiosError) {
  const originalRequest = error.config;
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => {
      return axiosClient.request(originalRequest);
    });
  }

  isRefreshing = true;
  const refreshToken = appCookies.getRefreshToken();

  const authApiURL = 'http://authen.system.funiverse.world/auth/refresh-token';
  try {
    const { accessToken } = await axios.post<{ accessToken: string }>(authApiURL, { refreshToken });
    appCookies.setAccessToken(accessToken);
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  } catch (error) {
    appCookies.clearAll();
    window.location.href = __DEV__
      ? 'http://localhost:8000/verify'
      : process.env.REACT_APP_REDIRECT_URL;
  }

  processQueue(null, null);

  return axiosClient.request(originalRequest);
}
