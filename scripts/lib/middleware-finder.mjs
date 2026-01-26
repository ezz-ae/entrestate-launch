import fs from 'node:fs';
import path from 'node:path';

const JS_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);
const MAX_SCAN_FILES = 400;
const MAX_SCAN_DEPTH = 5;

export function findMiddlewareCandidate(serverDir) {
  const stack = [{ dir: serverDir, depth: 0 }];
  const fallback = [];
  let filesChecked = 0;

  while (stack.length && filesChecked < MAX_SCAN_FILES) {
    const { dir, depth } = stack.pop();
    if (depth > MAX_SCAN_DEPTH) continue;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (filesChecked >= MAX_SCAN_FILES) break;

      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push({ dir: entryPath, depth: depth + 1 });
        continue;
      }

      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name);
      if (!JS_EXTENSIONS.has(ext)) continue;

      filesChecked += 1;
      try {
        const contents = fs.readFileSync(entryPath, 'utf8');
        if (contents.includes('x-mw')) {
          return entryPath;
        }
      } catch {
        // ignore
      }

      if (
        entry.name.toLowerCase().includes('middleware') ||
        entry.name.toLowerCase().includes('edge') ||
        dir.split(path.sep).includes('edge')
      ) {
        fallback.push(entryPath);
      }
    }
  }

  if (fallback.length > 0) {
    return fallback[0];
  }

  const edgeChunksDir = path.join(serverDir, 'edge', 'chunks');
  if (fs.existsSync(edgeChunksDir)) {
    const edgeEntries = fs
      .readdirSync(edgeChunksDir)
      .filter((name) => JS_EXTENSIONS.has(path.extname(name)));
    if (edgeEntries.length > 0) {
      return path.join(edgeChunksDir, edgeEntries[0]);
    }
  }

  return null;
}

export function printServerTree(rootDir, options = {}) {
  const { maxDepth = 3, maxEntries = 200 } = options;
  let counter = 0;

  function walk(dir, prefix = '', depth = 0) {
    if (counter >= maxEntries) return;
    if (!fs.existsSync(dir)) {
      console.error(`${prefix}(missing directory)`);
      return;
    }

    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (counter >= maxEntries) return;
      const marker = entry.isDirectory() ? '/' : '';
      console.error(`${prefix}${entry.name}${marker}`);
      counter += 1;
      if (entry.isDirectory() && depth < maxDepth) {
        walk(path.join(dir, entry.name), `${prefix}  `, depth + 1);
      }
    }
  }

  walk(rootDir);
}
