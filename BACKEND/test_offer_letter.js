
const { sendOfferLetter } = require("./controllers/offerLetter");

(async () => {
    try {
        console.log("Starting offer letter test...");
        const result = await sendOfferLetter({
            email: "test@example.com", // Replace with a safe test email if needed, or invalid to test SMTP connection only up to creation
            fullname: "Test Candidate",
            date: "06/02/2026",
            start: "10/02/2026",
            end: "10/08/2026",
            domain: "Web Development",
            duration: "6 Months",
            location: "Online"
        });
        console.log("Success:", result);
    } catch (error) {
        console.error("Caught Error:", error);
    }
})();
