import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");
const CONFIG_PATH = path.join(ROOT, "env-config.json");
const EXAMPLE_PATH = path.join(ROOT, ".env.example");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

// Priority groups to keep at the top
const PRIORITY_GROUPS = [
  { name: "FIREBASE & CLIENT CONFIG", prefix: "FIREBASE_" },
  { name: "AUTHENTICATION", prefix: "AUTH_" },
  { name: "DATABASE", prefix: "DATABASE_" },
  { name: "INFRASTRUCTURE", prefix: "VERCEL_" },
];

function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (["node_modules", ".git", ".next", "dist", "build"].includes(entry.name)) continue;
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...getAllFiles(res));
    else if (EXTENSIONS.includes(path.extname(entry.name))) files.push(res);
  }
  return files;
}

function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const keys = new Set();

  // Match process.env.KEY, process.env?.KEY, or process.env["KEY"]
  const dotRegex = /process\.env(?:\??\.)([A-Z0-9_]+)|process\.env\[['"`]([A-Z0-9_]+)['"`]\]/g;
  for (const m of content.matchAll(dotRegex)) keys.add(m[1] || m[2]);

  // Match const { KEY1, KEY2 } = process.env
  const destructureRegex = /(?:const|let|var)\s+\{([\s\S]*?)\}\s*=\s*process\.env/g;
  for (const m of content.matchAll(destructureRegex)) {
    m[1].split(",").forEach(k => keys.add(k.split(":")[0].replace(/[\n\r\s]/g, "").trim()));
  }
  return Array.from(keys).filter(k => k && /^[A-Z0-9_]+$/.test(k));
}

function parseEnv(content) {
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = line.indexOf("=");
    const key = idx === -1 ? trimmed : line.slice(0, idx).trim();
    const value = idx === -1 ? "" : line.slice(idx + 1).trim();
    env[key] = value;
  });
  return env;
}

// Extract comments from .env.example
function parseExampleComments(content) {
  const comments = {};
  content.split(/\r?\n/).forEach(line => {
    // Matches KEY=VALUE # Comment or KEY= # Comment
    const match = line.match(/^([A-Z0-9_]+)=.*?#\s*(.*)$/);
    if (match) comments[match[1]] = match[2].trim();
  });
  return comments;
}

function quoteValue(val) {
  if (typeof val !== "string") return '""';
  const cleaned = val.replace(/^['"]|['"]$/g, "");
  return (cleaned.includes(" ") || cleaned.includes("#")) ? `"${cleaned}"` : cleaned;
}

(async () => {
  const config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")) : {};
  const allFiles = getAllFiles(ROOT);
  
  const codeKeys = new Set();
  allFiles.forEach(f => extractKeysFromFile(f).forEach(k => codeKeys.add(k)));

  let existingEnv = {};
  if (fs.existsSync(ENV_PATH)) existingEnv = parseEnv(fs.readFileSync(ENV_PATH, "utf-8"));
  
  let exampleEnv = {};
  let exampleComments = {};
  if (fs.existsSync(EXAMPLE_PATH)) {
    const exampleRaw = fs.readFileSync(EXAMPLE_PATH, "utf-8");
    exampleEnv = parseEnv(exampleRaw);
    exampleComments = parseExampleComments(exampleRaw);
  }

  // Merge strategy: Existing > Example > Config > Code (empty)
  const allPossibleKeys = new Set([...codeKeys, ...Object.keys(existingEnv), ...Object.keys(exampleEnv)]);
  const finalEnv = {};
  allPossibleKeys.forEach(key => {
    finalEnv[key] = existingEnv[key] ?? exampleEnv[key] ?? config[key] ?? "";
  });

  // Organize into groups
  const totalKeys = Object.keys(finalEnv).length;
  const organized = {};
  const remainingKeys = new Set(Object.keys(finalEnv));

  // 1. Apply Priority Groups (Smart matching for NEXT_PUBLIC variants)
  PRIORITY_GROUPS.forEach(group => {
    const keys = Array.from(remainingKeys)
      .filter(k => k.startsWith(group.prefix) || k.startsWith(`NEXT_PUBLIC_${group.prefix}`))
      .sort();
    if (keys.length > 0) {
      organized[group.name] = keys;
      keys.forEach(k => remainingKeys.delete(k));
    }
  });

  // 2. Dynamically group remaining keys by their first prefix segment
  const dynamicKeys = Array.from(remainingKeys).sort();
  dynamicKeys.forEach(key => {
    // Handle NEXT_PUBLIC_SERVICE_KEY -> group by SERVICE
    const parts = key.split('_');
    const isPublic = key.startsWith('NEXT_PUBLIC_');
    const prefix = isPublic ? parts[2] : parts[0];
    
    if (prefix && prefix.length > 2) {
      const groupName = prefix.toUpperCase();
      if (!organized[groupName]) organized[groupName] = [];
      organized[groupName].push(key);
      remainingKeys.delete(key);
    }
  });

  // 3. Catch-all for anything else
  if (remainingKeys.size > 0) {
    organized["MISCELLANEOUS"] = Array.from(remainingKeys).sort();
  }

  // Build the file content
  let output = `# Generated by scripts/auto-env-fix.mjs\n# Last updated: ${new Date().toISOString()}\n\n`;
  
  for (const [groupName, keys] of Object.entries(organized)) {
    output += `# === ${groupName} ===\n`;
    keys.forEach(k => {
      const comment = exampleComments[k] ? ` # ${exampleComments[k]}` : "";
      output += `${k}=${quoteValue(finalEnv[k])}${comment}\n`;
    });
    output += `\n`;
  }

  fs.writeFileSync(ENV_PATH, output.trim() + "\n");

  // Validation: Check for empty public keys
  const emptyPublicKeys = Object.entries(finalEnv)
    .filter(([k, v]) => k.startsWith("NEXT_PUBLIC_") && (!v || v === '""'))
    .map(([k]) => k);

  console.log(`✅ .env.local reorganized and updated.`);
  console.log(`📊 Total keys: ${totalKeys} (${codeKeys.size} found in code)`);
  if (emptyPublicKeys.length > 0) {
    console.warn(`⚠️ Warning: The following public keys are empty: ${emptyPublicKeys.join(", ")}`);
  }
})();
