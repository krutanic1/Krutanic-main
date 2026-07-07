import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
        const bdaToken = localStorage.getItem("bdaToken");
        const operationToken = localStorage.getItem("operationToken");
        const advOperationToken = localStorage.getItem("advOperationToken");
        const advTeamToken = localStorage.getItem("advTeamToken");
        const medTeamToken = localStorage.getItem("medTeamToken");
        const marketingToken = localStorage.getItem("marketingToken");
        const hrToken = localStorage.getItem("hrToken");
        const token = localStorage.getItem("token");
        const adminToken = localStorage.getItem("adminToken");

        const currentPath = window.location.pathname.toLowerCase();

        // Path groups based on App.jsx routes
        const bdaPaths = ["/home", "/fullpaid", "/default", "/booked", "/onboarding", "/adduser", "/teamdetail", "/bdarevenuesheet", "/reference", "/companyleads", "/addteam", "/assigntarget", "/leaderboard"];
        const opPaths = ["/operationdashboard", "/fullpayment", "/bookedpayment", "/defaultpayment", "/operationrevenuesheet"];
        const advOpPaths = ["/advoperationdashboard", "/advfullpayment", "/advbookedpayment", "/advdefaultpayment", "/advoperationrevenuesheet"];

        // Only apply default tokens if no Authorization header is already set
        if (!config.headers.Authorization) {
            let selectedToken = null;

            if ((bdaPaths.includes(currentPath) || currentPath.includes("bda")) && bdaToken) {
                selectedToken = bdaToken;
            } else if (currentPath.includes("medteam") && medTeamToken) {
                selectedToken = medTeamToken;
            } else if (currentPath.includes("advteam") && advTeamToken) {
                selectedToken = advTeamToken;
            } else if ((advOpPaths.includes(currentPath) || currentPath.includes("advoperation")) && advOperationToken) {
                selectedToken = advOperationToken;
            } else if ((opPaths.includes(currentPath) || currentPath.includes("operation")) && operationToken) {
                selectedToken = operationToken;
            } else if (currentPath.includes("marketing") && marketingToken) {
                selectedToken = marketingToken;
            } else if (currentPath.includes("hr") && hrToken) {
                selectedToken = hrToken;
            } else if (token) {
                selectedToken = token;
            } else {
                // Fallback: use whatever available token
                selectedToken = adminToken || medTeamToken || bdaToken || advTeamToken || advOperationToken || operationToken || marketingToken || hrToken;
            }

            if (selectedToken) {
                config.headers.Authorization = selectedToken.startsWith("Bearer ") ? selectedToken : `Bearer ${selectedToken}`;
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
                } else if (currentPath.includes("medteam")) {
                    window.location.href = "/medloginteam";
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
