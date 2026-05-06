import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
        const bdaToken = localStorage.getItem("bdaToken");
        const operationToken = localStorage.getItem("operationToken");
        const advOperationToken = localStorage.getItem("advOperationToken");
        const advTeamToken = localStorage.getItem("advTeamToken");
        const token = localStorage.getItem("token");

        const currentPath = window.location.pathname.toLowerCase();

        // Only apply default tokens if no Authorization header is already set
        if (!config.headers.Authorization) {
            if ((currentPath.startsWith("/home") || currentPath.startsWith("/booked") || currentPath.includes("bda")) && bdaToken) {
                config.headers.Authorization = bdaToken;
            } else if (currentPath.includes("advteam") && advTeamToken) {
                config.headers.Authorization = advTeamToken;
            } else if (currentPath.includes("advoperation") && advOperationToken) {
                config.headers.Authorization = advOperationToken;
            } else if (currentPath.includes("operation") && operationToken) {
                config.headers.Authorization = operationToken;
            } else if (token) {
                config.headers.Authorization = token;
            }
        }



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
                    "advTeamToken", "advTeamId", "advTeamName", "advTeamSessionStartTime",
                    "atdToken", "atdUser"
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
                } else if (currentPath.includes("attendance")) {
                    window.location.href = "/attendance";
                } else {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
