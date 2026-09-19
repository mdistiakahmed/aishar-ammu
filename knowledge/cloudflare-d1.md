# Cloudflare D1

Binding name: `DB`  
Database name: `aishar-ammu`  
Migrations: `migrations/`  
Access in server code: `import { env } from "cloudflare:workers"` then `env.DB`

`--local` = SQLite on this machine (used by `npm run dev`)  
`--remote` = Cloudflare D1 (used after `npm run deploy`)

## Create a database

```bash
npx wrangler login
npx wrangler d1 create aishar-ammu
```

Copy the returned `database_id` into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "aishar-ammu",
    "database_id": "<id from create>",
    "migrations_dir": "migrations"
  }
]
```

## Add or change schema

1. Add a new file in `migrations/`, next number after the last one:

   `migrations/0002_description.sql`

2. Put SQL in that file (`CREATE TABLE`, `ALTER TABLE`, indexes).

3. Apply it:

```bash
npm run db:migrate:local
npm run db:migrate
```

Equivalent Wrangler commands:

```bash
npx wrangler d1 migrations apply DB --local
npx wrangler d1 migrations apply DB --remote
```

Apply **local first**, confirm the app works, then apply **remote**. Already-applied files are skipped.

Do not edit a migration that has already been applied. Add a new numbered file instead.

## Check database content

List tables:

```bash
npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

Count rows:

```bash
npx wrangler d1 execute DB --local --command "SELECT COUNT(*) AS users FROM users"
npx wrangler d1 execute DB --remote --command "SELECT COUNT(*) AS users FROM users"
```

Inspect users (omit `picture` to keep the output short):

```bash
npx wrangler d1 execute DB --local --command "SELECT id, email, name, pregnancy_start_date, next_doctor_visit_date, due_date, created_at, updated_at FROM users"
npx wrangler d1 execute DB --remote --command "SELECT id, email, name, pregnancy_start_date, next_doctor_visit_date, due_date, created_at, updated_at FROM users"
```

Look up one account:

```bash
npx wrangler d1 execute DB --local --command "SELECT * FROM users WHERE email = 'you@gmail.com'"
npx wrangler d1 execute DB --remote --command "SELECT * FROM users WHERE email = 'you@gmail.com'"
```

See which migrations have run:

```bash
npx wrangler d1 execute DB --local --command "SELECT * FROM d1_migrations"
npx wrangler d1 execute DB --remote --command "SELECT * FROM d1_migrations"
```

From a file:

```bash
npx wrangler d1 execute DB --local --file=./path/to/query.sql
npx wrangler d1 execute DB --remote --file=./path/to/query.sql
```

## List databases

```bash
npx wrangler d1 list
```
