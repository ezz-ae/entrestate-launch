import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const serverDir = path.join(root, '.next', 'server');
const middlewarePath = path.join(serverDir, 'middleware.js');
const nftPath = path.join(serverDir, 'middleware.js.nft.json');

if (!existsSync(serverDir)) {
  mkdirSync(serverDir, { recursive: true });
}

if (existsSync(nftPath)) {
  console.log('[vercel-nft-guard] OK');
  process.exit(0);
}

if (!existsSync(middlewarePath)) {
  const stubContent = `export function middleware(req) {\n  return;\n}\n\nexport const config = { matcher: [] };\n`;
  writeFileSync(middlewarePath, stubContent, 'utf8');
}

const nftContent = JSON.stringify({ version: 1, files: [] }, null, 2) + '\n';
writeFileSync(nftPath, nftContent, 'utf8');

console.log('[vercel-nft-guard] Created stub middleware.js.nft.json');
