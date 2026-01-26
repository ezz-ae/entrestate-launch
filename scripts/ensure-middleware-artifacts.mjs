import fs from 'node:fs';
import path from 'node:path';
import { findMiddlewareCandidate, printServerTree } from './lib/middleware-finder.mjs';

const serverDir = path.join(process.cwd(), '.next', 'server');
const shimPath = path.join(serverDir, 'middleware.js');
const nftPath = path.join(serverDir, 'middleware.js.nft.json');

function run() {
  const isVercel = Boolean(process.env.VERCEL);
  if (!isVercel) {
    console.log('[ensure-middleware] skipping (not running on Vercel)');
    return;
  }

  if (!fs.existsSync(serverDir)) {
    console.error('[ensure-middleware] .next/server missing; cannot bridge middleware artifacts');
    process.exitCode = 1;
    return;
  }

  const candidate = findMiddlewareCandidate(serverDir);
  if (!candidate) {
    console.error('[ensure-middleware] Unable to locate compiled middleware source file.');
    console.error('[ensure-middleware] .next/server tree (truncated):');
    printServerTree(serverDir, { maxDepth: 2, maxEntries: 200 });
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(shimPath)) {
    const relativePath = path.relative(serverDir, candidate).split(path.sep).join('/');
    fs.writeFileSync(shimPath, `module.exports = require('./${relativePath}');\n`);
    console.log(`[ensure-middleware] Created shim at ${path.relative(process.cwd(), shimPath)}`);
  } else {
    console.log('[ensure-middleware] Shim already exists');
  }

  if (!fs.existsSync(nftPath)) {
    fs.writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }, null, 2));
    console.log('[ensure-middleware] Created middleware.js.nft.json');
  } else {
    console.log('[ensure-middleware] middleware.js.nft.json already present');
  }
}

run();
