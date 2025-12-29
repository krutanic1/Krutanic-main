import axios from "axios";

// axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.request.use(
    (config) => {
        const bdaToken = localStorage.getItem("bdaToken");
        if (bdaToken) {
            config.headers.Authorization = bdaToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
axios.interceptors.request.use(
    (config) => {
        const operationToken = localStorage.getItem("operationToken");
        if (operationToken) {
            config.headers.Authorization = operationToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;