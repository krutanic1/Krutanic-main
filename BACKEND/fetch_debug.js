
const axios = require('axios');
const fs = require('fs');

async function fetchData() {
    try {
        const response = await axios.get('http://localhost:5000/events-with-applications');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

fetchData();
