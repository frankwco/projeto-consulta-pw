import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            config.headers.Authorization = `Bearer ${usuario.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
export default api;
