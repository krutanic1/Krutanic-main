const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, '../FRONTEND/src/page/MedProPacks.css');
const jsxFile = path.join(__dirname, '../FRONTEND/src/page/MedProPacks.jsx');

let cssContent = fs.readFileSync(cssFile, 'utf8');
let jsxContent = fs.readFileSync(jsxFile, 'utf8');

// 1. Update CSS Variables in :root
cssContent = cssContent.replace(
  /:root {[\s\S]*?}/,
  `:root {
  --mp-bg: #f8fafc;
  --mp-surface: #ffffff;
  --mp-surface-hover: #f1f5f9;
  --mp-border: #e2e8f0;
  --mp-text: #0f172a;
  --mp-muted: #64748b;
  --mp-glow: rgba(14, 165, 233, 0.1);
}`
);

// 2. Replace hardcoded light-on-dark styles to dark-on-light in CSS
const cssReplacements = [
  { search: /rgba\(255,\s*255,\s*255,\s*0\.05\)/g, replace: 'rgba(0,0,0,0.05)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.1\)/g, replace: 'rgba(0,0,0,0.1)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.15\)/g, replace: 'rgba(0,0,0,0.15)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.03\)/g, replace: 'rgba(0,0,0,0.03)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.02\)/g, replace: 'rgba(0,0,0,0.02)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.08\)/g, replace: 'rgba(0,0,0,0.08)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.07\)/g, replace: 'rgba(0,0,0,0.07)' },
  { search: /rgba\(0,\s*0,\s*0,\s*0\.3\)/g, replace: 'rgba(0,0,0,0.03)' }, 
  { search: /rgba\(10,\s*10,\s*20,\s*0\.8\)/g, replace: 'rgba(255,255,255,0.9)' },
  { search: /rgba\(20,\s*20,\s*30,\s*0\.9\)/g, replace: '#ffffff' },
  { search: /rgba\(20,\s*20,\s*30,\s*0\.6\)/g, replace: '#f8fafc' },
  { search: /color: #d1d5db;/g, replace: 'color: #475569;' },
  { search: /color: #e2e8f0;/g, replace: 'color: #334155;' },
  { search: /linear-gradient\(135deg, #ffffff 0%,/g, replace: 'linear-gradient(135deg, #0f172a 0%,' },
  { search: /background: radial-gradient\(circle at center, transparent 0%, var\(--mp-bg\) 100%\), url\('\/medpro\/hero_bg.png'\) center\/cover no-repeat;/g, replace: 'background: radial-gradient(circle at center, transparent 0%, var(--mp-bg) 100%);' }, 
  { search: /opacity: 0\.25;/g, replace: 'opacity: 0.1;' } 
];

cssReplacements.forEach(({ search, replace }) => {
  cssContent = cssContent.replace(search, replace);
});

// 3. Update the JSX preview gradients for light theme
jsxContent = jsxContent.replace(
  /gradient: "linear-gradient\(90deg, rgba\(10,10,20,0\.95\) 20%, rgba\((.*?)\) 100%\)"/g,
  'gradient: "linear-gradient(90deg, rgba(255,255,255,0.95) 20%, rgba($1) 100%)"'
);

// 4. Update JSX inline styles
jsxContent = jsxContent.replace(/color: "#d1d5db"/g, 'color: "#475569"');
jsxContent = jsxContent.replace(/color: "#e2e8f0"/g, 'color: "#334155"');
jsxContent = jsxContent.split('background: "linear-gradient(135deg, #ffffff 0%').join('background: "linear-gradient(135deg, #0f172a 0%');

fs.writeFileSync(cssFile, cssContent);
fs.writeFileSync(jsxFile, jsxContent);
console.log('Light theme applied!');
