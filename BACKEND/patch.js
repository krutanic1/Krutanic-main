const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'routes', 'AdvLead.js');
let content = fs.readFileSync(file, 'utf8');

const helperFunction = `
// Helper to auto-create First Call Task
async function autoCreateFirstCallTasks(leads, specialistId, teamId = null) {
    if (!leads || leads.length === 0) return;
    const AdvTask = require("../models/AdvTask");
    const now = new Date();
    const dueDateTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
    const dueTimeString = \`\${String(dueDateTime.getHours()).padStart(2, '0')}:\${String(dueDateTime.getMinutes()).padStart(2, '0')}\`;
    
    const tasksToInsert = leads.map(lead => ({
        lead_id: lead._id,
        lead_name: lead.full_name || lead.owner_name || "New Lead",
        student_mobile: lead.phone_number,
        counsellor_id: specialistId,
        team_id: teamId || lead.team_id,
        task_type: "First Call",
        priority: "High",
        due_date: dueDateTime,
        due_time: dueTimeString,
        remarks: "Auto-generated: Please make the first contact within 5 hours.",
        status: "Pending",
        created_at: now
    }));
    try {
        await AdvTask.insertMany(tasksToInsert, { ordered: false });
    } catch (err) {
        console.error("Failed to auto-create First Call tasks:", err);
    }
}
`;

// Insert the helper at line 30 if it's not already there
if (!content.includes('autoCreateFirstCallTasks')) {
    const lines = content.split('\n');
    lines.splice(29, 0, helperFunction);
    content = lines.join('\n');
}

// 1. /bulk-assign-to-specialist
if (!content.includes('await autoCreateFirstCallTasks(myLeads, specialistId);')) {
    content = content.replace(
        /res\.status\(200\)\.json\(\{ success: true, assigned: myLeads\.length, message: \`\$\{myLeads\.length\} lead\(s\) assigned to \$\{specialistName\}\` \}\);/g,
        `await autoCreateFirstCallTasks(myLeads, specialistId);\n        res.status(200).json({ success: true, assigned: myLeads.length, message: \`\${myLeads.length} lead(s) assigned to \${specialistName}\` });`
    );
}

// 2. /assign-lead-to-specialist/:id
if (!content.includes('await autoCreateFirstCallTasks([lead], specialistId);')) {
    content = content.replace(
        /res\.status\(200\)\.json\(lead\);\n    \} catch \(error\) \{/g,
        `await autoCreateFirstCallTasks([lead], specialistId);\n        res.status(200).json(lead);\n    } catch (error) {`
    );
}

// 3. /manual-bulk-assign (needs to check if dbRole is sr_inside_sales_specialist)
if (!content.includes('await autoCreateFirstCallTasks(leadsToAssign')) {
    content = content.replace(
        /res\.status\(200\)\.json\(\{ success: true, assigned: leadIds\.length/g,
        `if (dbRole === "sr_inside_sales_specialist") {\n            await autoCreateFirstCallTasks(leadsToAssign, assigneeId, team ? team._id : null);\n        }\n        res.status(200).json({ success: true, assigned: leadIds.length`
    );
}

// 4. /leader-bulk-assign-specialist
if (!content.includes('await autoCreateFirstCallTasks(myLeads, specialistId)')) {
    content = content.replace(
        /res\.status\(200\)\.json\(\{ success: true, assigned: myLeads\.length, message: \`\$\{myLeads\.length\} lead\(s\) assigned successfully\` \}\);/g,
        `await autoCreateFirstCallTasks(myLeads, specialistId);\n        res.status(200).json({ success: true, assigned: myLeads.length, message: \`\${myLeads.length} lead(s) assigned successfully\` });`
    );
}

fs.writeFileSync(file, content);
console.log('Patched AdvLead.js successfully');
