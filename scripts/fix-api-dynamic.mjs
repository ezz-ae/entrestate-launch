import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const API_ROOT = path.join(ROOT, "src/app/api");

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
let fixed = 0;

for (const file of routes) {
  let code = fs.readFileSync(file, "utf8");
  const original = code;

  let useServerDirective = '';
  if (code.startsWith('\'use server\';')) {
    useServerDirective = '\'use server\';\n\n';
    code = code.substring('\'use server\';'.length).trimStart();
  }

  // Remove illegal revalidate exports
  code = code.replace(/export\s+const\s+revalidate\s*=\s*0\s*;?\n?/g, "");

  // Remove fetch revalidate hints
  code = code.replace(/next:\s*{\s*revalidate\s*:\s*0\s*}\s*,?/g, "");

  // Remove force-cache
  code = code.replace(/cache:\s*['"]force-cache['"]\s*,?/g, "");

  // Remove dynamic flag if 'use server' is present
  if (useServerDirective) {
    code = code.replace(/export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]\s*;?\n?/g, "");
  }
  // Inject dynamic flag if missing AND 'use server' is not present
  else if (!code.includes("export const dynamic")) {
    code = `export const dynamic = 'force-dynamic';\n\n` + code;
  }
  
  // Re-add 'use server' directive at the very top if it was present
  code = useServerDirective + code;

  if (code !== original) {
    fs.writeFileSync(file, code);
    fixed++;
    console.log("✔ fixed", file.replace(ROOT + "/", ""));
  }
}

console.log(`\n✅ Fixed ${fixed} API routes`);