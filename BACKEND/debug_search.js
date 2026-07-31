const http = require('http');

const searchTerm = "vadirajinamdar25@gmail.com";
const url = `http://localhost:5000/delivered-certificates?page=1&limit=40&search=${encodeURIComponent(searchTerm)}`;

console.log(`Testing URL: ${url}`);

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Status Code:", res.statusCode);
            console.log("Certificates found:", json.deliveredCertificates?.length);
            if (json.deliveredCertificates?.length > 0) {
                console.log("First result email:", json.deliveredCertificates[0].email);
                console.log("First result name:", json.deliveredCertificates[0].name);
            } else {
                console.log("No results found.");
                // Print one result from empty search to see if it's ignoring the filter
                testEmptySearch();
            }
        } catch (e) {
            console.log("Error parsing JSON:", e.message);
            console.log("Raw Data:", data.substring(0, 200));
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});

function testEmptySearch() {
    console.log("--- Testing verification (is server ignoring filter?) ---");
    http.get(`http://localhost:5000/delivered-certificates?page=1&limit=1`, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            const json = JSON.parse(data);
            console.log("Unfiltered count:", json.totalCount);
        });
    });
}
