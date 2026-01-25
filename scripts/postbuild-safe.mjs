import { spawnSync } from 'node:child_process';

const HACK_SCRIPTS = [
  'scripts/fix-middleware-nft.mjs',
  'scripts/fix-react-loadable-manifest.mjs',
  'scripts/fix-page-client-reference-manifest.mjs',
];

function runHack(script) {
  const result = spawnSync('node', [script], { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`[postbuild] ${script} failed with exit code ${result.status}`);
  }
}

async function main() {
  if (process.env.VERCEL) {
    console.log('[postbuild] Skipping build hacks on Vercel.');
    return;
  }

  if (process.env.ENABLE_NEXT_BUILD_HACKS !== 'true') {
    console.log('[postbuild] Build hacks disabled (set ENABLE_NEXT_BUILD_HACKS=true to run locally).');
    return;
  }

  for (const script of HACK_SCRIPTS) {
    console.log(`[postbuild] Running ${script}...`);
    runHack(script);
  }
  console.log('[postbuild] Local build hacks finished.');
}

main().catch((error) => {
  console.error('[postbuild] Fatal error:', error);
  process.exit(1);
});
