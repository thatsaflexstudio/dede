# DEDE’S — GitHub + Vercel edition

This is the complete upload folder. It is standard Next.js, not the original Cloudflare/Sites application. Keep the contents of this folder together.

## Easiest deployment

1. Create a **new empty GitHub repository** so old Cloudflare configuration cannot conflict. A private repository is fine.
2. Choose **Add file → Upload files**. Open this folder, select **everything inside it**, and drag the selection into GitHub. Include the `app`, `lib`, `public`, `database`, and `tests` folders plus the files beside them. `package.json` must appear at the repository root. Upload the extracted files, **not a ZIP file**. Commit the upload.
3. In Vercel, choose **Add New → Project**, import that repository, and select **Next.js** as the framework. Leave **Root Directory** at the repository root (`./`), **Output Directory** at its default, and use **Node.js 22.x**. Build: `npm run build`. Install: `npm ci`.
4. Deploy. No environment variables are needed for the working on-device demo.

If reusing an existing repository, replace its old project files; uploading new files alone does not remove old files. In particular, do not retain old `vite.config.ts`, `wrangler` configuration, Sites scripts, or an old `package.json`. If you upload the containing folder instead of its contents, set Vercel's Root Directory to that folder.

## What works without configuration

- Responsive Spanish/English menu, logos, photos, search, categories, combinations, bottled drinks, add-ons and persistent cart.
- Demo checkout, receipts, status updates and the restaurant dashboard at `/admin`.
- **Orders, settings and sample email signups stay in that browser on that device.** They are not sent to a kitchen, shared with another device, or backed up on a server. Clearing browser storage removes them. A copied demo order link works only on that same browser/device.
- Opening signups need shared storage configured to reach the restaurant. Without it, they remain in browser storage.
- No actual payments, dispatch, delivery or outgoing emails are activated.

## Optional: shared kitchen dashboard and persistent storage

1. Create a Neon PostgreSQL database, directly or through the Vercel Marketplace integration. No account or paid service was created for you.
2. Open the Neon SQL Editor. Paste and run `database/schema.sql` once. It is safe to run again and does not delete existing tables/data.
3. Add these in **Vercel → Project → Settings → Environment Variables**, for the deployment environments you intend to use:

   - `DATABASE_URL`: the Neon PostgreSQL connection string.
   - `ADMIN_PASSWORD`: a unique password of at least 16 characters, at most 256.
   - `ADMIN_SESSION_SECRET`: a separate random secret of at least 32 characters. You can generate one locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
   - Optional `NEXT_PUBLIC_SITE_URL`: your full public website URL, such as your Vercel URL or custom domain, for social metadata.

4. Redeploy. Visit `/admin/login` and sign in with your admin password. The menu/settings and test orders are now shared through the database; ordinary visitors cannot access admin data or change settings. Rotating the password or session secret invalidates existing admin sessions.

Do not put passwords or connection strings in GitHub, `vercel.json`, screenshots, or chat. `.env.example` contains blanks only. For local development, copy it to `.env.local`, which Git ignores.

Shared storage still runs **demo-only orders**. Real launch requires confirmed menu, prices, taxes, service area, staff workflow, payment/dispatch arrangements and a separately implemented live-order activation. Signup addresses can be stored, but an email sending service is not connected. This package does not copy any customer records, settings, secrets or sign-in sessions from the previous Sites database.

## Local development and checks

Requires Node.js 22.13+ or 24. Use Node 22.x on Vercel.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run typecheck
npm run build
npm start
```

The automated tests exercise prices, modifiers, browser storage, retries, signed admin sessions and the PostgreSQL schema/order lifecycle using an isolated in-memory PostgreSQL engine. They do not connect to your real Neon account. A live Neon/Vercel deployment needs your account configuration and has not been performed here.

Never upload `node_modules`, `.next`, `.git`, local databases, build caches or environment files. `npm ci` recreates dependencies automatically; `.gitignore` prevents normal Git commits of generated files. GitHub's browser uploader accepts up to 100 files per upload and 25 MiB per file; this clean package is below both limits.

## Why the old folder was so big / failed on Vercel

The original project contained about 780 MiB of installed tools in `node_modules`, plus Git history, generated builds, image originals and temporary outputs. Those are local working files, not the website upload.

Its build used Vinext, Vite and Cloudflare Workers, its database required a D1 binding, and its authentication depended on Sites-injected identity headers. Uploading those files unchanged could not produce a normal Vercel deployment. This edition uses `next build`, Node-compatible routes, optional Neon storage and an independent admin session. Unused starter UI packages, sample files, original PNGs and all Cloudflare/Sites infrastructure have been excluded.

Design originals and unused images are kept outside this folder in `02-ASSET-ARCHIVE`. Only the eight WebP images actually needed by the current site are uploaded.

## Official references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)
- [Uploading files to GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
