import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const API_ROOT = path.join(ROOT, "src/app/api");

const BAD_PATTERNS = [
  /export\s+const\s+revalidate\s*=\s*0/,
  /next:\s*{\s*revalidate\s*:\s*0\s*}/,
  /cache:\s*['"]force-cache['"]/,
];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name === "route.ts") results.push(full);
  }
  return results;
}

const routes = walk(API_ROOT);
const broken = [];

for (const file of routes) {
  const code = fs.readFileSync(file, "utf8");
  if (BAD_PATTERNS.some(rx => rx.test(code))) {
    broken.push(file.replace(ROOT + "/", ""));
  }
}

if (!broken.length) {
  console.log("✅ No broken API routes found");
} else {
  console.log("❌ Broken API routes (will crash build):");
  broken.forEach(f => console.log(" -", f));
  process.exitCode = 1;
}