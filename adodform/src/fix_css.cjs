const fs = require('fs');
let content = fs.readFileSync('WarrFormPage.jsx', 'utf8');
content = content.replace(/className="warr-/g, 'className="avg-');
content = content.replace(/className={`warr-/g, 'className={`avg-');
fs.writeFileSync('WarrFormPage.jsx', content);
console.log('Fixed CSS classes in WarrFormPage.jsx');
