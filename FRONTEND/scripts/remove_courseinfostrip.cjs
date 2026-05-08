const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/tarun/OneDrive/Desktop/Krutanic-main-1/FRONTEND/src/page/AdvanceCourse';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const jsxRegex = /<CourseInfoStrip[\s\S]*?\/>/g;
  if (jsxRegex.test(content)) {
    content = content.replace(jsxRegex, '');
    changed = true;
  }

  const importRegex = /import\s+CourseInfoStrip\s+from\s+['"].\/Components\/CourseInfoStrip['"];?/g;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Removed CourseInfoStrip from', f);
  }
});
