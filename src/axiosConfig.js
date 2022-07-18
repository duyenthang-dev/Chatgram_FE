import axios from 'axios';
import jwt_decode from 'jwt-decode';
import authService from './services/authService';
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    timeout: 3000,
    headers: {
        contentType: 'application/json',
    },
});

// xử lý token
instance.interceptors.request.use(
    async (config) => {
        if (
            config.url.indexOf('/login') >= 0 ||
            config.url.indexOf('/register') >= 0 ||
            config.url.indexOf('/refresh-token') >= 0
        ) {
            return config;
        }

        let accessToken = localStorage.getItem('accessToken');
        let expires = null;
        if (accessToken) {
            accessToken = JSON.parse(localStorage.getItem('accessToken'));
            config.headers.Authorization = `Bearer ${accessToken}`;
            const { exp } = jwt_decode(accessToken);
            expires = exp;
        }

        if (accessToken && expires < new Date().getTime() / 1000) {
            
            console.log('jwt het han');
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
            console.log('refresh token: ' + refreshToken);
            const response = await authService.refreshToken(refreshToken);
            console.log(response)
            if (response.success) {
                localStorage.setItem('accessToken', JSON.stringify(response?.accessToken));
                localStorage.setItem('refreshToken', JSON.stringify(response?.refreshToken));
                config.headers.Authorization = `Bearer ${response?.accessToken}`;
                return config;
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export const setAuthToken = async (token) => {
    if (token) {
        console.log('setAuthToken');
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

export default instance;
