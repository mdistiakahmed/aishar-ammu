---
name: no-screen-testing
description: >-
  Do not run screen testing on your own. Use when changing UI, layout, or
  styles, and whenever browser checks, screenshots, headless Chrome,
  Playwright, Puppeteer, or DevTools layout measurements would otherwise be
  used to verify a page.
---

# No screen testing

Do not use any screen testing by yourselves.

Do not open the app, drive a browser, take screenshots, or measure rendered layout unless the user explicitly asks for that check.
