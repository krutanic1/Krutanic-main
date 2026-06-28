const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
    else if (p.endsWith('.js') || p.endsWith('.jsx')) r.push(p);
  });
  return r;
}

const files = walk('src');
let count = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let o = c;
  c = c.replace(/âœ–/g, '✖').replace(/âœ•/g, '✕').replace(/âœ“/g, '✓').replace(/âœ‰ï¸ /g, '✉️');
  if (c !== o) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed', f);
    count++;
  }
});
console.log('Total fixed:', count);
