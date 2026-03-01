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

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if the current path is already a login path to prevent infinite redirect loops
            const currentPath = window.location.pathname.toLowerCase();
            if (!currentPath.includes("login")) {
                localStorage.removeItem("token");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userId");

                // You could also clear other tokens if you want a global logout, 
                // but the prompt specific to "user session" usually implies the main user.
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axios;