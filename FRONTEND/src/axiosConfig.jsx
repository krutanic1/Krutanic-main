import axios from "axios";

axios.defaults.withCredentials = true;

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
                localStorage.removeItem("adminToken");

                // Clear other potential tokens if needed
                localStorage.removeItem("bdaToken");
                localStorage.removeItem("operationToken");
                localStorage.removeItem("advOperationToken");

                // Redirect based on path
                if (currentPath.startsWith("/admin") || currentPath.includes("admin")) {
                    window.location.href = "/AdminLogin";
                } else if (currentPath.startsWith("/bda") || currentPath.includes("bda")) {
                    window.location.href = "/TeamLogin";
                } else if (currentPath.startsWith("/operation") || currentPath.includes("operation")) {
                    window.location.href = "/OperationLogin";
                } else if (currentPath.startsWith("/advoperation") || currentPath.includes("advoperation")) {
                    window.location.href = "/AdvOperationLogin";
                } else {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axios;