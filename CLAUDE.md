@AGENTS.md

# Claude project notes

Follow `AGENTS.md` for Next.js version rules and Aishar Ammu conventions.

**Product:** Aishar Ammu — pregnancy, mother, and baby care.  
**Language:** English only.  
**Shell:** top bar, side menu, and site footer live in `components/`. New pages should render inside `AppShell` from `app/layout.tsx`.  
**Runtime:** vinext on Vite, deployed to Cloudflare Workers. Keep `next/*` imports; do not rewrite them.

Keep the layout mobile-friendly. Care content is educational only — not medical advice.
