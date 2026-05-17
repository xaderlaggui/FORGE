const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.expo')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
let fixed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const regex = /use([A-Z][a-zA-Z0-9]*)\./g;
  if (regex.test(content)) {
    content = content.replace(regex, (match, p1) => {
        return p1.charAt(0).toLowerCase() + p1.slice(1) + '.';
    });
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    fixed++;
  }
}
console.log(`Fixed ${fixed} files.`);
