const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'BACKEND', 'models', 'AdvCallActivity.js');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('AdvCallActivitySchema.post("save"')) {
    content = content.replace(
        'const AdvCallActivity = mongoose.models.AdvCallActivity',
        `// --- Mongoose Hooks for Auto-Task Creation from Call Logs (Permanent Fix) ---
AdvCallActivitySchema.post("save", async function(doc) {
    if (!doc.followUpDate) return;

    try {
        const AdvTask = mongoose.models.AdvTask || require("./AdvTask");
        const AdvLead = mongoose.models.AdvLead || require("./AdvLead");

        // Prevent duplicate tasks for the same followUpDate on this lead
        const existingTask = await AdvTask.findOne({ 
            lead_id: doc.leadId, 
            task_type: "Follow-up Call", 
            due_date: { 
                $gte: new Date(new Date(doc.followUpDate).setHours(0,0,0,0)), 
                $lt: new Date(new Date(doc.followUpDate).setHours(23,59,59,999)) 
            } 
        });

        if (existingTask) return;

        const lead = await AdvLead.findById(doc.leadId);
        if (!lead) return;

        const dueDateTime = new Date(doc.followUpDate);
        const dueTimeString = \`\${String(dueDateTime.getHours()).padStart(2, '0')}:\${String(dueDateTime.getMinutes()).padStart(2, '0')}\`;
        
        await new AdvTask({
            lead_id: doc.leadId,
            lead_name: lead.full_name || lead.owner_name || "New Lead",
            student_mobile: lead.phone_number,
            counsellor_id: doc.specialistId || lead.owner_id || lead.current_owner_id,
            team_id: doc.teamId || lead.team_id,
            task_type: doc.actionType === 'whatsapp' ? "WhatsApp Follow-up" : "Follow-up Call",
            priority: "High",
            due_date: dueDateTime,
            due_time: dueTimeString,
            remarks: doc.remark || doc.summary || "Auto-generated Follow-up Task from Call Log.",
            status: "Pending",
            created_at: new Date()
        }).save();
    } catch (err) {
        console.error("Failed to auto-create follow-up task from call log:", err);
    }
});
// ---------------------------------------------------------------------------------

const AdvCallActivity = mongoose.models.AdvCallActivity`
    );
}

fs.writeFileSync(file, content);
console.log('Patched AdvCallActivity.js');
