const axios = require('axios');

async function checkUser() {
    try {
        const email = "nikhilkrishnantv1999@gmail.com";
        console.log(`Checking user with email: ${email}`);

        // Adjust URL if needed, assuming localhost:5000 based on standard setup
        // Fetch all users to find the ID (since there's no direct search by email exposed publicly easily potentially, 
        // or I can try to use the existing endpoints)

        // Using the same endpoint as the frontend: /users (if available) or checking DB directly if I could (cannot).
        // Let's rely on /all-user-components logic if possible, but that needs authentication?

        // The frontend calls:
        // axios.get(`${API}/users`)
        // axios.get(`${API}/all-user-components`)

        // Let's try to mimic that.
        // Server.js shows app.use("/", User), app.use("/", admin) etc. so no /api prefix.
        const API = "http://localhost:5000";

        // Fetch all users
        const usersRes = await axios.get(`${API}/users`);
        const user = usersRes.data.find(u => u.email === email);

        if (!user) {
            console.log("User not found in /users");
            return;
        }

        console.log("User Found:", user._id, user.fullname);

        // Fetch components
        const compRes = await axios.get(`${API}/user-components?userId=${user._id}`);
        console.log("User Components:", compRes.data);

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

checkUser();
