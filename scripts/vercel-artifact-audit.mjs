import fs from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const serverDir = path.resolve('.next', 'server');
const appDir = path.join(serverDir, 'app');
const pagesDir = path.join(serverDir, 'pages');
const nextConfigFiles = ['next.config.mjs', 'next.config.cjs', 'next.config.js', 'next.config.ts'];

async function main() {
  console.log(`[vercel-artifact-audit] VERCEL=${process.env.VERCEL ?? 'unset'}`);
  console.log(`[vercel-artifact-audit] VERCEL_ENV=${process.env.VERCEL_ENV ?? 'unset'}`);
  console.log(`[vercel-artifact-audit] cwd=${cwd}`);

  await listDirectory(serverDir);
  await listDirectory(appDir);
  await listDirectory(pagesDir, { optional: true });

  await logCheck('.next/server/middleware.js', path.join(serverDir, 'middleware.js'));
  const middlewareNftPath = path.join(serverDir, 'middleware.js.nft.json');
  const middlewareNft = await logCheck('.next/server/middleware.js.nft.json', middlewareNftPath);
  const edgeMiddlewareManifestPath = path.join(serverDir, 'middleware', 'middleware-manifest.json');
  const hasEdgeMiddleware = await pathExists(edgeMiddlewareManifestPath);
  if (hasEdgeMiddleware) {
    console.log('[vercel-artifact-audit] Edge middleware manifest found at .next/server/middleware/middleware-manifest.json; legacy middleware.js artifacts are not generated in Next 16.');
  }

  const pagesDirExists = await pathExists(pagesDir);
  if (pagesDirExists) {
    await logCheck('.next/server/pages/_middleware.js', path.join(pagesDir, '_middleware.js'));
    await logCheck('.next/server/pages/_middleware.js.nft.json', path.join(pagesDir, '_middleware.js.nft.json'));
  } else {
    console.log('[vercel-artifact-audit] .next/server/pages directory missing; skipping page-level middleware checks.');
  }

  if (!middlewareNft && !hasEdgeMiddleware) {
    console.log(`[vercel-artifact-audit] ❗ middleware.js.nft.json missing in ${cwd}`);
    await printNextConfigSummary();
  }

  console.log('[vercel-artifact-audit] audit complete (exit 0).');
}

main().catch((error) => {
  console.error(`[vercel-artifact-audit] Unexpected error: ${error?.message ?? 'unknown error'}`);
  process.exitCode = 0;
});

async function listDirectory(targetDir, options = {}) {
  const relativePath = path.relative(cwd, targetDir) || '.';
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    console.log(`[vercel-artifact-audit] Contents of ${relativePath} (${entries.length})`);
    entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((entry) => {
        const marker = entry.isDirectory() ? '📁' : entry.isFile() ? '📄' : '❔';
        console.log(`  ${marker} ${entry.name}`);
      });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      if (options.optional) {
        console.log(`[vercel-artifact-audit] ${relativePath} is not present.`);
      } else {
        console.log(`[vercel-artifact-audit] ${relativePath} is missing.`);
      }
    } else {
      console.log(`[vercel-artifact-audit] Unable to read ${relativePath}: ${error?.message ?? 'unknown error'}`);
    }
  }
}

async function logCheck(label, targetPath) {
  const exists = await pathExists(targetPath);
  const relativePath = path.relative(cwd, targetPath) || '.';
  console.log(`[vercel-artifact-audit] Check ${label} (${relativePath}): ${exists ? 'FOUND' : 'MISSING'}`);
  return exists;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function printNextConfigSummary() {
  let printedAtLeastOne = false;
  for (const configFile of nextConfigFiles) {
    const configPath = path.resolve(configFile);
    if (!(await pathExists(configPath))) {
      continue;
    }
    printedAtLeastOne = true;
    const contents = await fs.readFile(configPath, 'utf8');
    const lines = contents.split(/\r?\n/).slice(0, 40);
    console.log(`[vercel-artifact-audit] ${configFile} (first ${lines.length} lines):`);
    lines.forEach((line, index) => console.log(`  ${index + 1}: ${line}`));
  }
  if (!printedAtLeastOne) {
    console.log('[vercel-artifact-audit] No next.config.* file found to summarize.');
  }
}
