/**
 * Secret and PII scanner for this repository.
 *
 * Scans everything git tracks (so it mirrors exactly what a public clone would
 * expose) for credentials, customer data and payment details. Exits non-zero on
 * any finding, which makes it usable as a pre-push or CI gate.
 *
 *   node scripts/scan-secrets.mjs
 *   node scripts/scan-secrets.mjs --staged      # scan the staged tree instead
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const staged = process.argv.includes('--staged');

/** Vendored/binary files we do not author and cannot meaningfully scan. */
const SKIP = [
  /(^|\/)package-lock\.json$/,
  /(^|\/)jquery-[\d.]+\.min\.js$/,
  /(^|\/)bootstrap\.bundle\.min\.js$/,
  /^frontend\/css\//,
  /^frontend\/webfonts\//,
  /\.(png|jpe?g|gif|webp|ico|mp4|webm|ttf|woff2?|eot|pdf|docx|xlsx|zip)$/i,
];

/**
 * Each rule has an `allow` list of substrings that mark a match as an accepted
 * placeholder or test fixture. Anything not on that list is reported.
 */
const RULES = [
  {
    name: 'OpenAI-style API key',
    re: /\bsk-[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: 'AWS access key id',
    re: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: 'GitHub token',
    re: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    name: 'Slack token',
    re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    name: 'Google/Firebase API key',
    re: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    name: 'Private key block',
    re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g,
  },
  {
    name: 'Bearer token literal',
    re: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}=*/g,
  },
  {
    name: 'MongoDB URI with credentials',
    re: /\bmongodb(?:\+srv)?:\/\/[^\s"'<>]+:[^\s"'<>]+@[^\s"'<>]+/g,
    allow: ['USERNAME:PASSWORD', '<user>:<password>', 'user:pass'],
  },
  {
    name: 'Hardcoded secret/password/token assignment',
    re: /\b(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|client[_-]?secret)\s*[:=]\s*['"]([^'"]{8,})['"]/gi,
    allow: [
      'CHANGE_ME',
      'YOUR_',
      'HERE',
      'example',
      'placeholder',
      'not-a-real-password-fixture',
      'test-only-value-not-a-real-secret',
      'wrong-password',
      'process.env',
    ],
  },
  {
    name: 'Saudi IBAN',
    // Real IBANs are 24 characters; the all-zero placeholder is allowed.
    re: /\bSA[0-9]{2}[\s]?(?:[0-9A-Z]{4}[\s]?){5}\b|\bSA[0-9]{22}\b/g,
    allow: ['SA00 0000 0000 0000 0000 0000', 'SA0000000000000000000000'],
  },
  {
    name: 'Saudi national ID',
    // Synthetic ids used by seeds/tests follow the 10000000xx pattern.
    re: /\b[12][0-9]{9}\b/g,
    allow: ['1000000000', '1000000001', '1000000002', '1000000003', '1000000004', '1000000005'],
  },
  {
    name: 'Bank account number (12-16 digits)',
    re: /\b[0-9]{12,16}\b/g,
    allow: ['0000000000'],
    // Phone numbers and URLs are the same length; mask them out first so a
    // WhatsApp link does not read as an account number.
    maskPhones: true,
  },
];

/**
 * Contact details that belong to the business and are published on the live
 * site on purpose. Tracked so the report can show them, but not failures.
 */
const KNOWN_PUBLIC = [/\+?9665[0-9]{8}/g];

function trackedFiles() {
  const args = staged
    ? ['diff', '--cached', '--name-only', '--diff-filter=ACM']
    : ['ls-files'];
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim().replace(/^"|"$/g, ''))
    .filter(Boolean)
    .filter((file) => !SKIP.some((re) => re.test(file)));
}

/**
 * Blanks out published phone numbers and URLs so numeric rules do not fire on
 * a WhatsApp link. Replaces with same-length filler to keep column numbers sane.
 */
function maskPhones(line) {
  return line
    .replace(/(?:\+|00)?9665[0-9]{8}/g, (m) => '#'.repeat(m.length))
    .replace(/https?:\/\/\S+/g, (m) => '#'.repeat(m.length));
}

function isAllowed(rule, match, line) {
  if (!rule.allow) return false;
  return rule.allow.some((token) => match.includes(token) || line.includes(token));
}

const findings = [];
let scanned = 0;

for (const file of trackedFiles()) {
  const abs = path.join(repoRoot, file);
  let content;
  try {
    content = fs.readFileSync(abs, 'utf8');
  } catch {
    continue;
  }
  // Skip binary blobs (a NUL byte is the reliable tell).
  if (content.includes('\u0000')) continue;

  scanned += 1;
  const lines = content.split(/\r?\n/);

  for (const rule of RULES) {
    lines.forEach((rawLine, index) => {
      const line = rule.maskPhones ? maskPhones(rawLine) : rawLine;
      rule.re.lastIndex = 0;
      for (const match of line.matchAll(rule.re)) {
        if (isAllowed(rule, match[0], line)) continue;
        findings.push({
          file,
          line: index + 1,
          rule: rule.name,
          excerpt: rawLine.trim().slice(0, 120),
        });
      }
    });
  }
}

const publicContacts = new Set();
for (const file of trackedFiles()) {
  let content;
  try {
    content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  } catch {
    continue;
  }
  for (const re of KNOWN_PUBLIC) {
    for (const match of content.matchAll(re)) publicContacts.add(match[0]);
  }
}

console.log(`Scanned ${scanned} tracked text files${staged ? ' (staged)' : ''}.`);

if (publicContacts.size > 0) {
  console.log(
    `\nNote — published business contact numbers (not treated as secrets): ${[...publicContacts].join(', ')}`
  );
}

if (findings.length === 0) {
  console.log('\nSecret scan: PASS — no secrets, credentials or customer data found.');
  process.exit(0);
}

console.error(`\nSecret scan: FAIL — ${findings.length} finding(s):`);
for (const finding of findings) {
  console.error(`  ${finding.file}:${finding.line}  [${finding.rule}]`);
  console.error(`      ${finding.excerpt}`);
}
process.exit(1);
