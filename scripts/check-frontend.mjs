/**
 * Static checks for the frontend, which has no bundler or compiler.
 *
 * Verifies that every first-party script parses, that no page references a
 * missing local asset, and that the dead API host never creeps back in.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..', 'frontend');
const VENDOR = new Set(['jquery-3.7.1.min.js', 'bootstrap.bundle.min.js']);
const DEAD_HOST = 'inmaa.vercel.app';

const problems = [];

// 1. Every first-party script must parse.
for (const name of fs.readdirSync(path.join(root, 'js'))) {
  if (!name.endsWith('.js') || VENDOR.has(name)) continue;
  const file = path.join(root, 'js', name);
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    problems.push(`syntax error in js/${name}: ${err.stderr?.toString().split('\n')[0]}`);
  }
}

// 2. Local asset references must resolve.
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const ref = match[1].split('#')[0].split('?')[0];
    if (!ref || /^(https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) continue;
    if (!fs.existsSync(path.join(root, decodeURIComponent(ref)))) {
      problems.push(`${page} references missing asset: ${ref}`);
    }
  }
}

// 3. The retired backend host must not reappear.
for (const dir of ['', 'js']) {
  const base = path.join(root, dir);
  for (const name of fs.readdirSync(base)) {
    const file = path.join(base, name);
    if (!fs.statSync(file).isFile()) continue;
    if (!/\.(js|html)$/.test(name) || VENDOR.has(name)) continue;
    if (fs.readFileSync(file, 'utf8').includes(DEAD_HOST)) {
      problems.push(`${path.join(dir, name)} still references the retired host ${DEAD_HOST}`);
    }
  }
}

if (problems.length > 0) {
  console.error('Frontend check failed:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(`Frontend check passed (${pages.length} pages).`);
