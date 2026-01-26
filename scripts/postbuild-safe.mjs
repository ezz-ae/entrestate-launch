import fs from 'node:fs';
import path from 'node:path';

const isVercel = Boolean(process.env.VERCEL);
const serverDir = path.join(process.cwd(), '.next', 'server');
const middlewareJs = path.join(serverDir, 'middleware.js');
const middlewareNft = path.join(serverDir, 'middleware.js.nft.json');

const reportFile = (label, filePath) => {
  const exists = fs.existsSync(filePath);
  console.log(`[postbuild-safe] ${label} ${exists ? 'found' : 'missing'}`);
  return exists;
};

if (isVercel) {
  reportFile('.next/server/middleware.js', middlewareJs);
  reportFile('.next/server/middleware.js.nft.json', middlewareNft);
} else {
  console.log('[postbuild-safe] No mutations performed; .next/server stays untouched.');
}
