const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find all <button ... > tags
  const buttonRegex = /<button[^>]*>/gi;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const btnTag = match[0];
    if (!btnTag.includes('onClick') && !btnTag.includes('type="submit"') && !btnTag.includes('formAction')) {
      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;
      console.log(`Potential dead button in ${filePath}:${lineNumber} -> ${btnTag}`);
    }
  }
});
