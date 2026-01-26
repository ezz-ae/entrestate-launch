import fs from 'node:fs';
import path from 'node:path';
import { findMiddlewareCandidate, printServerTree } from './lib/middleware-finder.mjs';

function readNextVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    return (
      pkg.dependencies?.next ||
      pkg.devDependencies?.next ||
      pkg.peerDependencies?.next ||
      'unknown'
    );
  } catch {
    return 'unknown';
  }
}

function main() {
  const serverDir = path.join(process.cwd(), '.next', 'server');
  const shimPath = path.join(serverDir, 'middleware.js');
  const shimExists = fs.existsSync(shimPath);
  const candidate = findMiddlewareCandidate(serverDir);

  if (shimExists || candidate) {
    console.log('[verify] middleware bundle detected');
    return;
  }

  console.error('[verify] middleware artifacts missing from .next/server');
  console.error(`[verify] Node ${process.version}, Next ${readNextVersion()}`);
  console.error('[verify] .next/server (trimmed tree):');
  printServerTree(serverDir, { maxDepth: 2, maxEntries: 200 });
  process.exitCode = 1;
}

main();
