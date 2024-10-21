import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logoutEndpoint, refreshTokenEndpoint } from "./endpoints";

const TIMEOUT = 15000;

const retryHttpCodes = [401, 403];
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


const api = axios.create({
    baseURL: 'http://localhost:8765',
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const responseObject = error.response?.data as { message: string };
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        if (!error?.response || !originalRequest || originalRequest.url?.includes('/auth')) {
            return Promise.reject(error);
        }
        if (responseObject.message === 'jwt expired' || (retryHttpCodes.includes(error.response.status) && !originalRequest._retry)) {
            originalRequest._retry = true;
            try {
                const { data } = await api.get(refreshTokenEndpoint);
                const newAccessToken = data.result.accessToken;
                localStorage.setItem('token', newAccessToken);
                api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                await api.post(logoutEndpoint);
                localStorage.removeItem('token');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
