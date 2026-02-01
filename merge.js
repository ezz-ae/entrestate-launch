const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname); // merge everything in the project root
const OUTPUT_FILE = path.join(__dirname, 'merged.js');

function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) return; // skip node_modules and hidden
      getAllFiles(fullPath, files);
    } else if (fullPath.match(/\.(js|ts|jsx|tsx)$/)) {
      files.push(fullPath);
    }
  });
  return files;
}

const allFiles = getAllFiles(SRC_DIR);
console.log(`Found ${allFiles.length} code files.`);

let mergedContent = '';
allFiles.forEach(file => {
  mergedContent += `\n// ===== ${file} =====\n`;
  mergedContent += fs.readFileSync(file, 'utf-8') + '\n';
});

fs.writeFileSync(OUTPUT_FILE, mergedContent);
console.log(`Merged into ${OUTPUT_FILE}`);