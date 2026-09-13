@AGENTS.md

# Claude project notes

Follow `AGENTS.md` for Next.js version rules and Aishar Ammu conventions.

**Product:** Aishar Ammu (আয়শার আম্মু) — pregnancy, mother, and baby care.  
**Default locale:** Bengali. Keep `en` and `bn` in sync in `lib/i18n.ts`.  
**Shell:** top bar, side menu, and site footer live in `components/`. New pages should render inside `AppShell` from `app/layout.tsx`.

When changing UI, update both languages and keep the layout mobile-friendly. Care content is educational only — not medical advice.
