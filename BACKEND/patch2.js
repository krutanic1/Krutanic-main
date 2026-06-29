const fs = require('fs');
const file = 'c:\\Users\\tarun\\OneDrive\\Desktop\\Krutanic-main-1\\BACKEND\\routes\\AdvLead.js';
let content = fs.readFileSync(file, 'utf8');

// Fix role mapping in /admin-bulk-assign
if (!content.includes('dbRole = "sr_inside_sales_specialist";')) {
    content = content.replace(
        /if \(assigneeRole\.includes\("Leader"\)\) \{\n            dbRole = "leader";\n            dbStatus = "assigned_to_leader";\n        \}/,
        `if (assigneeRole.includes("Leader") || assigneeRole.toLowerCase().includes("leader")) {
            dbRole = "leader";
            dbStatus = "assigned_to_leader";
        } else if (assigneeRole.toLowerCase().includes("specialist") || assigneeRole.toLowerCase().includes("sales")) {
            dbRole = "sr_inside_sales_specialist";
            dbStatus = "assigned_to_specialist";
        }`
    );
}

// Add task creation in /admin-bulk-assign
if (!content.includes('await autoCreateFirstCallTasks(freshLeads')) {
    content = content.replace(
        /res\.status\(200\)\.json\(\{\n            success: true,\n            assigned: freshLeads\.length,/,
        `if (dbRole === "sr_inside_sales_specialist") {\n            await autoCreateFirstCallTasks(freshLeads, assigneeId, team ? team._id : null);\n        }\n        res.status(200).json({\n            success: true,\n            assigned: freshLeads.length,`
    );
}

fs.writeFileSync(file, content);
console.log('Patched AdvLead.js admin-bulk-assign');
