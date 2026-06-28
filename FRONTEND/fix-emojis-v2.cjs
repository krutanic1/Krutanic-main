const fs = require('fs');
const path = require('path');

const replacements = {
  'â‚¹': '₹',
  'ðŸŽ¯': '🎯',
  'âœ…': '✅',
  'â ³': '⏳',
  'ðŸ †': '🏆',
  'ðŸ“Š': '📊',
  'ðŸ’¼': '💼',
  'ðŸš€': '🚀',
  'ðŸ“ˆ': '📈',
  'ðŸ“': '📋',
  'ðŸ¤': '🤝',
  'â–¶ï¸': '▶️',
  'â­': '⭐',
  'ðŸ–±ï¸': '🖱️',
  'ðŸ–±': '🖱️',
  'ðŸ“‹': '📋',
  'â™»ï¸': '♻️',
  'ðŸŸ¢': '🟢',
  'ðŸŸ¡': '🟡',
  'ðŸ”„': '🔄',
  'ðŸ“†': '📆',
  'â€”': '—',
  'â–¼': '▼',
  'â–²': '▲',
  'âœ—': '✗',
  'âœ”': '✔',
  'ðŸ”': '🔒',
  'ðŸ”“': '🔓',
  'ðŸ””': '🔔',
  'ðŸ—‘ï¸': '🗑️',
  'ðŸ—‘': '🗑️',
  'ðŸ“¢': '📣',
  'ðŸ‘¥': '👥',
  'ðŸ‘¤': '👤',
  'ðŸ”Ž': '🔍',
  'ðŸ’°': '💰',
  'ðŸŽ‰': '🎉',
  'ðŸ‘‹': '👋',
  'ðŸ˜Š': '😊',
  'ðŸ˜': '😎',
  'âš ï¸': '⚠️',
  'âš': '⚠️',
  'â„¹ï¸': 'ℹ️',
  'ðŸš¨': '🚨',
  'ðŸ’¡': '💡',
  'ðŸ”§': '🔧',
  'ðŸ“Œ': '📌',
  'ðŸ“': '📍'
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src'));
let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
    totalReplaced++;
  }
});

console.log('Total files fixed:', totalReplaced);
