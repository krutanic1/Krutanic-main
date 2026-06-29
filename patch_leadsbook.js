const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'frontend', 'src', 'AdvTeam', 'AdvLeadsBook.jsx');
let content = fs.readFileSync(file, 'utf8');

// Import useLocation
if (!content.includes('useLocation')) {
    content = content.replace('import { useNavigate } from "react-router-dom";', 'import { useNavigate, useLocation } from "react-router-dom";');
    if (!content.includes('useLocation')) {
        content = content.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport { useNavigate, useLocation } from "react-router-dom";');
    }
}

// Add const location = useLocation();
if (!content.includes('const location = useLocation();')) {
    content = content.replace('const AdvLeadsBook = () => {', 'const AdvLeadsBook = () => {\n    const location = useLocation();');
}

// Modify activeLead and searchTerm
if (!content.includes('location.state?.autoOpenLeadId')) {
    content = content.replace(
        'const [activeLead, setActiveLead] = useState(null);',
        'const [activeLead, setActiveLead] = useState(location.state?.autoOpenLeadId || null);'
    );
}

if (!content.includes('location.state?.searchPhone')) {
    content = content.replace(
        'const [searchTerm, setSearchTerm] = useState("");',
        'const [searchTerm, setSearchTerm] = useState(location.state?.searchPhone || "");'
    );
}

fs.writeFileSync(file, content);
console.log('Patched AdvLeadsBook.jsx');
