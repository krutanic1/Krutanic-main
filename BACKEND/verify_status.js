const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testStatusToggle() {
    try {
        // 1. Get all operations
        console.log('Fetching operations...');
        const res = await axios.get(`${API_URL}/getoperation`);
        const operations = res.data;

        if (operations.length === 0) {
            console.log('No operations found to test.');
            return;
        }

        const testOp = operations[0];
        console.log(`Testing with Operation: ${testOp.fullname} (ID: ${testOp._id})`);
        console.log(`Initial Status: ${testOp.isOnline}`);

        // 2. Toggle Status
        console.log('Toggling status...');
        const toggleRes = await axios.put(`${API_URL}/toggleonlinestatus/${testOp._id}`);
        console.log('Toggle Response:', toggleRes.data);

        // 3. Verify update
        console.log('Verifying update...');
        const verifyRes = await axios.get(`${API_URL}/getoperation?operationId=${testOp._id}`);
        const updatedOp = verifyRes.data;
        console.log(`New Status: ${updatedOp.isOnline}`);

        if (String(updatedOp.isOnline) === String(toggleRes.data.isOnline)) {
            console.log('✅ Status toggled successfully!');
        } else {
            console.error('❌ Status toggle verification failed!');
        }

        // 4. Revert
        console.log('Reverting status...');
        await axios.put(`${API_URL}/toggleonlinestatus/${testOp._id}`);
        console.log('✅ Reverted successfully.');

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testStatusToggle();
