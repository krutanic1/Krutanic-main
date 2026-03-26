import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const bdaToken = localStorage.getItem("bdaToken");
        const operationToken = localStorage.getItem("operationToken");
        const advOperationToken = localStorage.getItem("advOperationToken");
        const advTeamToken = localStorage.getItem("advTeamToken");

        if (token) config.headers.Authorization = token;
        if (bdaToken) config.headers.Authorization = bdaToken;
        if (operationToken) config.headers.Authorization = operationToken;
        if (advOperationToken) config.headers.Authorization = advOperationToken;
        if (advTeamToken) config.headers.Authorization = advTeamToken;

        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname.toLowerCase();
            if (!currentPath.includes("login") && !currentPath.includes("loginadmin") && !currentPath.includes("/marketing/login")) {
                // Clear ALL tokens
                const keysToRemove = [
                    "token", "userEmail", "userId", "adminToken",
                    "bdaToken", "operationToken", "advOperationToken",
                    "advTeamToken", "advTeamId", "advTeamName", "advTeamSessionStartTime"
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));

                // Redirect based on path
                if (currentPath.includes("admin")) {
                    window.location.href = "/AdminLogin";
                } else if (currentPath.includes("advteam")) {
                    window.location.href = "/AdvTeamLogin";
                } else if (currentPath.includes("advoperation")) {
                    window.location.href = "/AdvOperationLogin";
                } else if (currentPath.includes("bda") || currentPath.startsWith("/home") || currentPath.startsWith("/booked")) {
                    window.location.href = "/TeamLogin";
                } else if (currentPath.includes("operation")) {
                    window.location.href = "/OperationLogin";
                } else {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axios;