# Vercel edition

- This is standard Next.js with Node routes. Do not reintroduce Sites/Vinext, Cloudflare bindings, or trusted identity headers.
- Preserve Spanish/English parity, the restored clean header wordmark, integer DOP minor-unit prices and demo-only ordering.
- Without DATABASE_URL, demo data belongs only to the current browser. Keep that limitation visible. Never silently fall back to browser storage after a configured database fails.
- With DATABASE_URL, guard every admin read/write with the signed HttpOnly session, validate totals on the server, and preserve atomic idempotency keys and private tracking tokens.
- Never commit secrets, local records, node_modules or .next.
- Run npm test and npm run build for ordering/backend changes. Use the local PostgreSQL test engine; never send tests to a real customer database.
