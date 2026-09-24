# Database migrations

```bash
# Local D1 (dev)
npm run db:migrate:local

# Remote D1 (production)
npm run db:migrate
```

# Inspect D1 data

```bash
# Local
npx wrangler d1 execute DB --local --command "SELECT * FROM users;"

# Remote
npx wrangler d1 execute DB --remote --command "SELECT * FROM users;"
```

Other useful queries:

```bash
npx wrangler d1 execute DB --local --command "SELECT id, email, preferred_name, baby_gender FROM users;"
npx wrangler d1 execute DB --local --command "SELECT * FROM mother_weight_logs;"
npx wrangler d1 execute DB --local --command "SELECT * FROM sessions;"
```

# Delete D1 data

```bash
# Delete one user by email (local)
npx wrangler d1 execute DB --local --command "DELETE FROM users WHERE email = 'you@example.com';"

# Clear all users (local) — destructive
npx wrangler d1 execute DB --local --command "DELETE FROM users;"
```

For production, replace `--local` with `--remote`.

# Cloudflare Dashboard (remote only)

Workers & Pages → D1 → database `aishar-ammu` → Console / Explore to run SQL in the browser.
