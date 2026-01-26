import fs from 'node:fs';
import path from 'node:path';

const isVercel = Boolean(process.env.VERCEL);
const serverDir = path.join(process.cwd(), '.next', 'server');
const middlewareNft = path.join(serverDir, 'middleware.js.nft.json');

if (isVercel) {
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  if (!fs.existsSync(middlewareNft)) {
    fs.writeFileSync(
      middlewareNft,
      JSON.stringify({ version: 1, files: [] }, null, 2)
    );
    console.log('[postbuild] Created missing middleware.js.nft.json');
  } else {
    console.log('[postbuild] middleware nft present');
  }
} else {
  console.log('[postbuild-safe] No mutations performed; .next/server stays untouched.');
}
