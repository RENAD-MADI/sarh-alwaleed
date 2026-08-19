# صرح الوليد للخدمات العقارية — Sarh Al-Waleed Real Estate Services

Web platform for **Sarh Al-Waleed**, a licensed Saudi real estate brokerage, used to
collect and manage applications for the **unified electronic rental contract**
(العقد الإلكتروني الموحد) registered through the Ejar network.

The public site presents the company's services and hosts three multi-step contract
application forms. Staff use a set of protected dashboards to review submissions,
open the attached documents, and track each application through to issuance.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Creating an admin account](#creating-an-admin-account)
- [Seeding sample data](#seeding-sample-data)
- [Development commands](#development-commands)
- [API reference](#api-reference)
- [Testing](#testing)
- [Production build and deployment](#production-build-and-deployment)
- [Public repository notes](#public-repository-notes)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Copyright](#copyright)

---

## Features

**Public site**

- Arabic, right-to-left, responsive across mobile and desktop.
- Company profile, unified-contract explainer, and real estate marketing section.
- Downloadable official contract templates (PDF / DOCX).
- Contact form with validation and delivery confirmation.

**Contract applications** — three independent multi-step forms, each carrying its
answers forward in `sessionStorage` and submitting once at the final step:

| Contract | Steps | Entry page |
| --- | --- | --- |
| Residential (سكني) | 4 | `Residentialcontract.html` |
| Commercial (تجاري) | 6 | `Commercialcontract.html` |
| Sublease (بالباطن) | 5 | `subcontract.html` |

Each submission accepts scanned attachments (ID cards, title deed, commercial
registration, power of attorney) as JPEG, PNG or PDF.

**Staff dashboards** — sign-in protected, one per contract type plus a contact
inbox. Paginated, with attachment viewing and an application status workflow
(`pending → in_review → issued | rejected`).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, Bootstrap 5, vanilla JavaScript, jQuery, axios |
| Backend | Node.js 20+, Express 4 (ES modules) |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT in an httpOnly cookie, bcrypt password hashing |
| Uploads | Multer, stored on disk behind authentication |
| Validation | Zod (request payloads) + Mongoose schema validation |
| Security | Helmet (CSP), CORS, express-rate-limit |
| Testing | `node:test`, Supertest, mongodb-memory-server |
| Tooling | ESLint 9 |

---

## Architecture

```
Browser (static pages in frontend/)
    |
    |  axios, same-origin, cookies attached
    v
Express API (backend/src)
    |
    +-- routes/       path + method, auth guards, rate limits
    +-- middleware/   auth, upload, validation, error handling
    +-- controllers/  request handling and response shaping
    +-- models/       Mongoose schemas
    |
    v
MongoDB                     backend/uploads/ (attachments, auth-gated)
```

The API process also serves the static site, so the admin pages and the session
cookie that protects them share a single origin. Set `SERVE_FRONTEND=false` if a
CDN serves the frontend instead — then also set `CORS_ORIGINS`.

**Frontend API configuration is centralised in
[`frontend/js/config.js`](frontend/js/config.js).** Every request goes through
`API.url()`. Do not hardcode a host anywhere else.

---

## Project structure

```
.
├── frontend/                     Static site (no build step)
│   ├── index.html                Landing page
│   ├── login.html                Staff sign-in
│   ├── 404.html                  Not-found page
│   ├── Residentialcontract.html  Residential form, steps 1-4 (contract2..5.html)
│   ├── Commercialcontract.html   Commercial form, steps 1-6 (commerical2..7.html)
│   ├── subcontract.html          Sublease form, steps 1-5 (subcontract1..5.html)
│   ├── Contractdashboard.html    Residential dashboard
│   ├── commericaldashboard.html  Commercial dashboard
│   ├── subcontractdasboard.html  Sublease dashboard
│   ├── messages.html             Contact inbox
│   ├── payment.html              Issuance-fee transfer details
│   ├── css/  js/  Assets/  webfonts/
│   └── js/config.js              API base URL + shared helpers
│       js/dashboard-core.js      Auth guard, paging, attachment rendering
│       js/contract-submit.js     Shared final-step submission
│
├── backend/
│   ├── src/
│   │   ├── server.js             Entry point, graceful shutdown
│   │   ├── app.js                Express app, security middleware
│   │   ├── config/env.js         Environment loading and validation
│   │   ├── db/connect.js         MongoDB connection
│   │   ├── models/               Mongoose schemas
│   │   ├── middleware/           auth, upload, rateLimit, validate, errorHandler
│   │   ├── controllers/          contract, message, auth
│   │   ├── routes/               Route table
│   │   ├── validators/           Zod schemas
│   │   └── scripts/              seed, createAdmin, devServer
│   ├── tests/                    Integration tests
│   └── uploads/                  Attachments (gitignored)
│
├── scripts/
│   ├── check-frontend.mjs     Static checks for the frontend
│   └── scan-secrets.mjs       Secret / PII scanner for tracked files
└── LICENSE                    Proprietary licence — all rights reserved
```

---

## Requirements

- **Node.js 20 or newer** (`node -v`)
- **npm 9 or newer**
- **MongoDB 6 or newer** — a local server, or a MongoDB Atlas cluster

You can skip MongoDB for a quick look: see [`npm run demo`](#development-commands),
which starts an in-memory database.

---

## Installation

```bash
git clone <repository-url>
cd "صرح الوليد"
npm install
```

`npm install` installs the backend workspace too.

Then create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Generate a signing secret and paste it into `backend/.env` as `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Environment variables

All backend configuration lives in `backend/.env`. The full list with comments is
in [`backend/.env.example`](backend/.env.example).

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | no | `development` | `development` \| `production` \| `test` |
| `PORT` | no | `5000` | HTTP port |
| `HOST` | no | `0.0.0.0` | Bind address |
| `MONGODB_URI` | yes | none | Connection string |
| `JWT_SECRET` | **yes in production** | random per boot (dev only) | Signs session tokens |
| `JWT_EXPIRES_IN` | no | `8h` | Session lifetime |
| `COOKIE_NAME` | no | `sarh_admin_token` | Session cookie name |
| `CORS_ORIGINS` | no | empty | Comma-separated origins; empty means same-origin only |
| `UPLOAD_DIR` | no | `./uploads` | Where attachments are written |
| `MAX_UPLOAD_BYTES` | no | `5242880` (5 MB) | Per-file size limit |
| `MAX_FILES_PER_FIELD` | no | `5` | Files per attachment field |
| `SERVE_FRONTEND` | no | `true` | Serve `../frontend` from the API |
| `FRONTEND_DIR` | no | `../frontend` | Static site location |
| `SEED_ADMIN_EMAIL` | no | empty | Default for `create-admin` |
| `SEED_ADMIN_PASSWORD` | no | empty | Default for `create-admin` |

With `NODE_ENV=production`, a missing `JWT_SECRET` stops the server at boot rather
than falling back to a guessable default.

---

## Database setup

No migration step is required — Mongoose creates collections and indexes on first
connect. Set `MONGODB_URI` and start the server.

**Local MongoDB**

```bash
mongod --dbpath /path/to/data
# MONGODB_URI=mongodb://127.0.0.1:27017/sarh_alwaleed
```

**MongoDB Atlas**

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/sarh_alwaleed?retryWrites=true&w=majority
```

Collections created: `residential_contracts`, `commercial_contracts`,
`sub_contracts`, `messages`, `admin_users`.

To rebuild indexes after changing a schema:

```bash
node -e "import('./backend/src/db/connect.js').then(async m => { await m.connectDatabase(); const { default: M } = await import('./backend/src/models/ResidentialContract.js'); await M.syncIndexes(); process.exit(0); })"
```

---

## Creating an admin account

There is no public sign-up and no default account. Create the first login
explicitly:

```bash
npm run create-admin -- --email you@example.com --password "a-long-strong-password" --name "Your Name" --role admin
```

Passwords must be at least 12 characters. Re-running with an existing email updates
that account's password, name and role.

Then sign in at `/login.html`.

---

## Seeding sample data

For local development only — it refuses to run when `NODE_ENV=production`:

```bash
npm run seed
```

This **deletes** all contracts and messages, then inserts a few sample records so
the dashboards have something to display. It does not create login accounts.

---

## Development commands

Run from the repository root:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the API with file watching (needs MongoDB) |
| `npm start` | Start the API |
| `npm run demo` | Start the full stack against a throwaway **in-memory** MongoDB. A demo admin with a randomly generated password is created and printed to the console. No MongoDB install needed. |
| `npm run seed` | Reset and insert sample data |
| `npm run create-admin -- --email … --password …` | Create or update a staff login |
| `npm test` | Run the backend test suite |
| `npm run lint` | Lint backend and frontend |
| `npm run typecheck` | Parse-check the backend module graph and frontend scripts |
| `npm run scan:secrets` | Scan every tracked file for secrets, credentials and customer data |
| `npm run scan:staged` | Same scan, limited to what is staged for commit |
| `npm run build` | `typecheck` + `lint` + `scan:secrets` + `test` — the full gate |

Then open <http://localhost:5000>.

The frontend has no build step: edit the HTML/CSS/JS and reload.

---

## API reference

Base URL is the API origin. All responses are JSON with a `success` boolean.

**Public**

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe |
| `POST` | `/message/addMessage` | Submit the contact form |
| `POST` | `/realEsate/add` | Submit a residential application (multipart) |
| `POST` | `/commercial/add` | Submit a commercial application (multipart) |
| `POST` | `/elbaten/add` | Submit a sublease application (multipart) |
| `POST` | `/auth/login` | Staff sign-in; sets the session cookie |
| `POST` | `/auth/logout` | Clear the session cookie |

**Authenticated** (session cookie required; `<type>` is `realEsate`, `commercial` or `elbaten`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/auth/me` | Current staff user |
| `GET` | `/message` | List contact enquiries |
| `PATCH` | `/message/:id/read` | Mark an enquiry read |
| `GET` | `/<type>` | Ids and counts only |
| `GET` | `/<type>/page?page=N&limit=M` | One page of full records |
| `GET` | `/<type>/:id` | A single application |
| `PATCH` | `/<type>/:id/status` | Update application status |
| `GET` | `/uploads/:filename` | Fetch an attachment |

Rate limits: 300 requests / 15 min overall, 20 submissions / hour, 10 failed
logins / 15 min.

> The `/realEsate` and `/elbaten` spellings are retained from the original API so
> existing links and any external integrations keep working.

---

## Testing

```bash
npm test
```

24 integration tests run against an in-memory MongoDB — no local database or
network access needed. They cover authentication and session handling, access
control on every protected endpoint, payload validation, upload type/size
rejection, protection of server-owned fields, and pagination metadata.

Full pre-commit gate — this also fails the build if a secret, credential,
IBAN or national ID reaches a tracked file:

```bash
npm run build
```

---

## Production build and deployment

There is no compile step. To deploy:

1. Install production dependencies: `npm install --omit=dev`
2. Provide `backend/.env` with `NODE_ENV=production`, a real `MONGODB_URI`, and a
   strong `JWT_SECRET`.
3. **Serve over HTTPS.** Session cookies are marked `secure` in production and the
   browser will not send them over plain HTTP.
4. Put `UPLOAD_DIR` on persistent storage. On an ephemeral filesystem (Heroku,
   default Vercel, most container platforms) attachments are lost on restart —
   mount a volume or move to object storage.
5. Run behind a reverse proxy (nginx, Caddy) terminating TLS. `trust proxy` is
   already enabled so rate limiting sees real client IPs.
6. Start with a process manager: `pm2 start backend/src/server.js --name sarh-api`

Back up MongoDB and `UPLOAD_DIR` together — a contract record is incomplete
without its attachments.

---

## Public repository notes

This repository is published publicly, so it deliberately contains **no real
credentials, customer data or payment details**.

**Bank details are placeholders.** `frontend/js/config.js` holds a `BANK` block
with `YOUR_ACCOUNT_NUMBER_HERE` / `SA00 0000 0000 0000 0000 0000`. Until real
values are set, the payment and confirmation pages ask the visitor to contact
the office instead of showing a number. Set the real values **only on the
deployed copy** — never commit them.

**There is no default admin account.** Create one with `npm run create-admin`.
`npm run demo` generates a random password per run and prints it once.

**Seed and test data are synthetic.** Names are `Test …`, phone numbers are
`05000000xx`, and national IDs are `10000000xx`. None of it is real.

**Nothing in this repository grants access to anything.** A clone gives no
database access, no admin login, no API key, no storage access and no customer
data. Everything sensitive is supplied at runtime through `backend/.env`, which
is gitignored.

Before any push:

```bash
npm run scan:secrets
```

What remains in the repository by design: the company's published business
contact details (phone, email, social links) that already appear on the live
public website, and the blank official Ejar contract templates under
`frontend/Assets/files/`.

---

## Security notes

- Dashboards and every read endpoint require a signed-in staff account. Contract
  data includes national ID numbers, IBANs and scanned identity documents.
- Sessions are httpOnly, `SameSite=Strict` cookies, `secure` in production. Tokens
  are never exposed to JavaScript.
- Attachments are stored under random filenames and served only to authenticated
  staff. Uploaded filenames are never trusted.
- Values rendered into the dashboards are HTML-escaped — contract fields are
  attacker-supplied.
- Request bodies are never logged.
- **Never commit `backend/.env` or the contents of `backend/uploads/`.** Both
  are gitignored; `npm run scan:secrets` is the backstop.

---

## Troubleshooting

**`MongooseServerSelectionError` on startup**
MongoDB is not reachable. Confirm it is running and `MONGODB_URI` is correct. For
Atlas, allow your IP in Network Access.

**`Missing required environment variable JWT_SECRET`**
`NODE_ENV=production` with no secret set. Generate one and put it in `backend/.env`.

**Login succeeds but every page bounces back to the login screen**
The session cookie is not coming back. Either you are on plain HTTP in production
(cookies are `secure`), or the frontend is on a different origin — set
`CORS_ORIGINS` to that origin, or serve the site from the API.

**Attachments show as broken images**
The session expired (they are auth-gated), or `UPLOAD_DIR` changed / was wiped by
a redeploy on an ephemeral filesystem.

**"Only JPEG, PNG or PDF files are allowed"**
By design. Adjust `ALLOWED_MIME` in `backend/src/middleware/upload.js` if the
business genuinely needs another format.

**Submissions return 429**
The rate limiter. Tune the windows in `backend/src/middleware/rateLimit.js`.

**Contact form or dashboards do nothing**
Check the API base in `frontend/js/config.js` and that the API is running.

---

## Copyright

© 2026 RENAD MADI. All rights reserved.

This project and its source code are proprietary and may not be copied, modified,
distributed, or commercially reused without permission from RENAD MADI.

Viewing the source in this public repository is permitted for reference and
evaluation only; publishing it here grants no licence or right of reuse. Full
terms are in [LICENSE](LICENSE).

Third-party libraries (Bootstrap, jQuery, Font Awesome, Animate.css, axios,
Express, Mongoose and their dependencies) remain under their own licences. The
official Saudi unified rental contract templates under `frontend/Assets/files/`
are published government documents.
