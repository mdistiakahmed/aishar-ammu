<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aishar Ammu — আয়শার আম্মু

Pregnancy, mother, and baby care web app. Default language is **Bengali** (`bn`). English is opt-in via the top-bar toggle.

## Stack

- vinext (Next.js App Router API on Vite), React 19, TypeScript, Tailwind CSS v4
- Deploy to Cloudflare Workers with `@vinext/cloudflare` (`npm run deploy`)
- Next.js remains installed for reference; use `npm run dev:next` only if needed
- Path alias: `@/*` → repo root
- Do not rewrite `next/*` imports — vinext shims them

## Layout and i18n

- Shell: `components/app-shell.tsx` (top bar, mobile drawer / desktop sidebar, `components/site-footer.tsx`)
- Copy: `lib/i18n.ts` — add every user-facing string to **both** `en` and `bn`
- Locale: `components/language-provider.tsx` — default `bn`, persist `aishar-ammu-locale`
- Do not hardcode UI copy in components
- Fonts: Hind Siliguri (Latin + Bengali) and Fraunces in `app/layout.tsx`

## UI conventions

- Mobile first: 44px-class tap targets, stacked CTAs, drawer menu below `lg`
- Warm palette: petal background, rose accents, sage for tool actions
- Homepage: `components/home-page.tsx` — tools, then months 1–10 (mother + baby)
- Care copy is general wellbeing only. Never present it as a diagnosis or a substitute for a doctor.

## Do not

- Remove or rewrite the Next.js agent-rules block above
- Invent medical claims, drug doses, or treatment plans
- Skip Bengali strings, or make English the default locale
