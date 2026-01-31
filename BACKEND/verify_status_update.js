const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testStatusUpdate() {
    try {
        console.log("Fetching all events...");
        const response = await axios.get(`${API_URL}/events-with-applications`);
        const events = response.data;

        if (events.length === 0) {
            console.log("No events found to test.");
            return;
        }

        const event = events[0];
        console.log(`Target Event ID: ${event._id}`);
        console.log(`Current Status: ${event.status}`);

        const newStatus = event.status === "Ongoing" ? "Upcoming Events" : "Ongoing";
        console.log(`Attempting to update status to: ${newStatus}`);

        const updateResponse = await axios.put(`${API_URL}/updateeventstatus/${event._id}`, {
            status: newStatus
        });

        console.log("Update Response Status:", updateResponse.status);
        console.log("Update Response Data:", updateResponse.data);

        // Verify update
        const verifyResponse = await axios.get(`${API_URL}/events-with-applications`);
        const updatedEvent = verifyResponse.data.find(e => e._id === event._id);

        console.log(`New Status in DB: ${updatedEvent.status}`);

        if (updatedEvent.status === newStatus) {
            console.log("SUCCESS: Status updated correctly.");
        } else {
            console.log("FAILURE: Status did not update.");
        }

    } catch (error) {
        console.error("Error during test:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testStatusUpdate();
