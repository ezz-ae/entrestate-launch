import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const serverDir = path.join(repoRoot, '.next', 'server');
const middlewareJson = path.join(serverDir, 'middleware.js.nft.json');
const middlewareJs = path.join(serverDir, 'middleware.js');
const proxyJson = path.join(serverDir, 'proxy.js.nft.json');
const proxyJs = path.join(serverDir, 'proxy.js');

const log = (message) => console.log(`[fix-middleware-nft] ${message}`);

if (!fs.existsSync(serverDir)) {
  log('Skipping fix: .next/server directory is missing (build may have failed earlier).');
  process.exit(0);
}

if (fs.existsSync(middlewareJson)) {
  log('middleware.js.nft.json already exists; nothing to do.');
} else {
  const copied = copyCandidate();
  if (!copied) {
    try {
      fs.writeFileSync(middlewareJson, JSON.stringify({ version: 1, files: [] }, null, 2));
      log('No suitable .nft.json candidate found; created an empty middleware.js.nft.json fallback.');
    } catch (error) {
      log(`No suitable .nft.json candidate found and failed to write fallback: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }
}

if (!fs.existsSync(middlewareJs) && fs.existsSync(proxyJs)) {
  try {
    fs.copyFileSync(proxyJs, middlewareJs);
    log('Copied proxy.js -> middleware.js as fallback.');
  } catch (error) {
    log(`Unable to copy proxy.js -> middleware.js: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
} else if (!fs.existsSync(middlewareJs)) {
  try {
    fs.writeFileSync(
      middlewareJs,
      [
        "'use strict';",
        '',
        '// Auto-generated fallback to satisfy Vercel packaging when middleware.js is missing.',
        'function middleware() {',
        '  return;',
        '}',
        '',
        'const config = { matcher: [] };',
        '',
        'module.exports = { middleware, config };',
        '',
      ].join('\n')
    );
    log('Created fallback middleware.js stub to satisfy packaging.');
  } catch (error) {
    log(`middleware.js key file not generated, and failed to write stub: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

function copyCandidate() {
  if (fs.existsSync(proxyJson)) {
    return tryCopy(proxyJson, middlewareJson, 'proxy nft metadata');
  }

  const candidates = findNftFiles(serverDir).filter((candidate) => candidate !== middlewareJson);
  if (!candidates.length) {
    return false;
  }

  const middlewareCandidate = candidates.find((candidate) => path.basename(candidate).toLowerCase().includes('middleware'));
  const proxyCandidate = candidates.find((candidate) => path.basename(candidate).toLowerCase().includes('proxy'));
  const candidate = middlewareCandidate || proxyCandidate || candidates[0];
  return tryCopy(candidate, middlewareJson, 'best nft candidate');
}

function tryCopy(src, dest, note) {
  try {
    fs.copyFileSync(src, dest);
    log(`Copied ${path.relative(repoRoot, src)} -> ${path.relative(repoRoot, dest)} (${note}).`);
    return true;
  } catch (error) {
    log(`Failed to copy ${note}: ${error instanceof Error ? error.message : 'unknown error'}`);
    return false;
  }
}

function findNftFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findNftFiles(entryPath));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.nft.json')) continue;
    results.push(entryPath);
  }
  return results;
}
