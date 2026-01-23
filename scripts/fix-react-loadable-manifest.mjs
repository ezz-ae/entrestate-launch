import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const serverDir = path.join(repoRoot, '.next', 'server');
const targetDir = path.join(serverDir, 'page');
const targetFile = path.join(targetDir, 'react-loadable-manifest.json');

const log = (message) => console.log(`[fix-react-loadable-manifest] ${message}`);

if (!fs.existsSync(serverDir)) {
  log('Skipping fix: .next/server directory is missing (build may have failed earlier).');
  process.exit(0);
}

if (fs.existsSync(targetFile)) {
  log('react-loadable-manifest.json already exists under .next/server/page; nothing to do.');
  process.exit(0);
}

const preferredCandidates = [
  path.join(serverDir, 'app', '(marketing)', 'page', 'react-loadable-manifest.json'),
  path.join(serverDir, 'app', 'page', 'react-loadable-manifest.json'),
];

for (const candidate of preferredCandidates) {
  if (fs.existsSync(candidate)) {
    copyCandidate(candidate, targetFile, 'preferred app root');
    process.exit(0);
  }
}

const candidates = findManifestFiles(serverDir);
const ranked = candidates
  .map((candidate) => ({ candidate, score: rankCandidate(candidate) }))
  .sort((a, b) => b.score - a.score || a.candidate.length - b.candidate.length);

if (!ranked.length) {
  log('No react-loadable-manifest.json files found in .next/server; skipping copy.');
  process.exit(0);
}

copyCandidate(ranked[0].candidate, targetFile, 'best available candidate');

function copyCandidate(src, dest, note) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    log(`Copied ${path.relative(repoRoot, src)} -> ${path.relative(repoRoot, dest)} (${note}).`);
  } catch (error) {
    log(`Failed to copy manifest (${note}): ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

function findManifestFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findManifestFiles(entryPath));
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name !== 'react-loadable-manifest.json') continue;
    results.push(entryPath);
  }
  return results;
}

function rankCandidate(candidate) {
  const normalized = candidate.split(path.sep).join('/');
  let score = 0;
  if (normalized.includes('/app/')) score += 3;
  if (normalized.includes('/page/')) score += 2;
  if (normalized.includes('/_not-found/')) score -= 2;
  if (normalized.includes('/_global-error/')) score -= 2;
  if (normalized.includes('/(marketing)/page/')) score += 2;
  return score;
}
