import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MOBILE_DIR = path.join(ROOT, 'src', 'mobile');
const DISALLOWED = [
  /from\s+['"]firebase\/.+['"]/,
  /from\s+['"]firebase['"]/,
  /from\s+['"]firebase\/firestore['"]/,
  /from\s+['"]@supabase\/.+['"]/,
  /from\s+['"]@supabase\/supabase-js['"]/,
  /from\s+['"]supabase-js['"]/,
  /from\s+['"]@supabase\/ssr['"]/,
];

const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  for (const pattern of DISALLOWED) {
    if (pattern.test(content)) {
      violations.push(pattern.toString());
    }
  }
  return violations;
}

if (!fs.existsSync(MOBILE_DIR)) {
  console.warn('[check-mobile-imports] src/mobile not found, skipping.');
  process.exit(0);
}

const files = walk(MOBILE_DIR);
const errors = [];

for (const file of files) {
  const violations = scanFile(file);
  if (violations.length) {
    errors.push({ file, violations });
  }
}

if (errors.length) {
  console.error('[check-mobile-imports] Direct DB SDK imports are not allowed in src/mobile.');
  for (const error of errors) {
    console.error(`- ${path.relative(ROOT, error.file)}: ${error.violations.join(', ')}`);
  }
  process.exit(1);
}

console.log('[check-mobile-imports] OK');
