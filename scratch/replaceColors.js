const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, '../FRONTEND/src/page/MedProPacks.css');
const jsxFile = path.join(__dirname, '../FRONTEND/src/page/MedProPacks.jsx');

let cssContent = fs.readFileSync(cssFile, 'utf8');
let jsxContent = fs.readFileSync(jsxFile, 'utf8');

const replacements = [
  { search: /#c084fc/g, replace: '#0ea5e9' }, // Purple -> Sky Blue
  { search: /#e879f9/g, replace: '#10b981' }, // Pink -> Emerald
  { search: /#8b5cf6/g, replace: '#0284c7' }, // Purple -> Deep Sky Blue
  { search: /rgba\(192,132,252/g, replace: 'rgba(14,165,233' }, // Purple rgb
  { search: /rgba\(192, 132, 252/g, replace: 'rgba(14, 165, 233' }, // Purple rgb
  { search: /rgba\(232,121,249/g, replace: 'rgba(16,185,129' }, // Pink rgb
  { search: /rgba\(139,92,246/g, replace: 'rgba(14,165,233' } // Purple rgb
];

replacements.forEach(({ search, replace }) => {
  cssContent = cssContent.replace(search, replace);
  jsxContent = jsxContent.replace(search, replace);
});

fs.writeFileSync(cssFile, cssContent);
fs.writeFileSync(jsxFile, jsxContent);
console.log('Colors replaced successfully!');
