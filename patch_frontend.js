const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'frontend', 'src', 'AdvTeam', 'AdvTaskManager.jsx');
let content = fs.readFileSync(file, 'utf8');

// Import useNavigate
if (!content.includes('useNavigate')) {
    content = content.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport { useNavigate } from "react-router-dom";');
}

// Add const navigate
if (!content.includes('const navigate = useNavigate();')) {
    content = content.replace('const AdvTaskManager = () => {', 'const AdvTaskManager = () => {\n    const navigate = useNavigate();');
}

// Add onClick to motion.tr
if (!content.includes('onClick={() => navigate')) {
    content = content.replace(
        /className="border-b border-slate-700\/50 hover:bg-slate-800\/50 transition-colors group"/,
        `className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors group cursor-pointer"\n                                                onClick={() => navigate('/advteam/leads-book', { state: { searchPhone: task.student_mobile, autoOpenLeadId: task.lead_id } })}`
    );
}

fs.writeFileSync(file, content);
console.log('Patched AdvTaskManager.jsx');
