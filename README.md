# منصة رصد للامن السيبراني

# Cybersecurity Monitoring Platform

A production-ready static cybersecurity monitoring dashboard for GitHub Pages. The app tracks recent CVEs, CISA Known Exploited Vulnerabilities, EPSS risk, cybersecurity news, trends, source health, data freshness, and deterministic risk indicators.

The platform is fully static: no backend, no database, no AI API, no paid APIs, and no notification or alerting system.

## Features

- Bilingual Arabic and English interface with full RTL/LTR layout switching.
- Arabic mode displays local deterministic Arabic operational summaries for CVEs and news while preserving technical identifiers such as CVE, CVSS, EPSS, KEV, URL, PoC, and RSS.
- Dark mode by default, light mode support, and persisted local preferences.
- Dashboard for critical CVEs, KEV, high EPSS, exploit and patch indicators, news, source health, and freshness.
- Searchable and filterable CVE table with CVSS, EPSS, KEV, CWE, references, flags, priority score, and detail modal.
- Deduplicated cybersecurity news feed with keyword-based categorization.
- Trend charts for severity, categories, sources, timeline, EPSS buckets, and vendor severity heatmap.
- Dedicated pages for KEV, Zero-Day, Ransomware, Cloud Security, AI Security, and Supply Chain.
- Source health dashboard with status, last fetch, item count, errors, and health score.
- Watchlists for vendors, products, and keywords stored in localStorage.
- Saved filters, shareable hash URL filters, browser CSV/JSON export, keyboard shortcuts, and a manual static-data refresh button.
- Responsive shell for mobile, tablet, laptop, desktop, large, and ultrawide screens.

## Screenshots

Add project screenshots here after publishing to GitHub Pages.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- Zod
- Node.js data scripts
- Static JSON under `public/data`
- GitHub Actions
- GitHub Pages
- localStorage

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. On this Windows machine, `npm.cmd` may be needed if PowerShell blocks `npm.ps1`.

## Build

```bash
npm run build
npm run preview
```

## Manual Data Update

```bash
npm run update:data
```

The updater writes these static files:

- `public/data/cves.json`
- `public/data/kev.json`
- `public/data/news.json`
- `public/data/trends.json`
- `public/data/sources.json`
- `public/data/meta.json`

If a source fails, the update continues and records the failure in `sources.json` and `meta.json`. If live fetches and previous files are unavailable, a bundled fallback sample keeps the UI usable.

The app also has a header refresh button. Because GitHub Pages is static and has no secure backend token, the button reloads the latest committed JSON files with cache busting. It does not directly trigger a new GitHub Actions workflow run from the public page. To force a new source fetch, use the manual `workflow_dispatch` button in GitHub Actions or run `npm run update:data` locally.

## Automatic 15-Minute Updates

`.github/workflows/update-data.yml` runs:

```yaml
cron: "*/15 * * * *"
```

The workflow:

- Runs every 15 minutes and supports `workflow_dispatch`.
- Uses Node.js 20.
- Runs `npm ci`.
- Runs `npm run update:data`.
- Commits only changed files under `public/data`.
- Avoids empty/no-op commits.
- Uses `permissions: contents: write`.

GitHub Pages is static. The update model is:

GitHub Actions every 15 minutes -> fetch APIs/RSS -> generate JSON -> commit updated JSON -> GitHub Pages serves the latest committed data.

Scheduled workflows may occasionally be delayed by GitHub, but the configured interval is 15 minutes.

## Deployment To GitHub Pages

`.github/workflows/deploy.yml` builds the Vite app and deploys `dist` with the official GitHub Pages actions.

Repository settings:

- Enable GitHub Pages.
- Set the source to GitHub Actions.
- Ensure Actions can read and write repository contents for the update workflow.

For project sites, set `VITE_BASE_PATH=/repository-name/` if needed. The app uses hash routing to avoid GitHub Pages 404s.

## Optional Environment Variables

- `NVD_API_KEY`: optional NVD API key for higher request allowance.

The client app does not expose private tokens.

## Data Sources

- NVD CVE API 2.0
- CISA Known Exploited Vulnerabilities JSON
- FIRST EPSS API
- RSS feeds from The Hacker News, BleepingComputer, SecurityWeek, Dark Reading, CISA, Microsoft, Google, Cloudflare, Palo Alto Unit 42, Cisco Talos, and Google Cloud Security

## Bilingual And Direction Support

Arabic mode:

- `lang="ar"`
- `dir="rtl"`
- Sidebar on the right
- RTL layout, filters, tables, cards, and navigation
- Arabic UI labels and Arabic operational summaries for external CVE/news content

English mode:

- `lang="en"`
- `dir="ltr"`
- Sidebar on the left
- LTR layout

Technical identifiers such as CVE, CVSS, EPSS, KEV, URLs, and vectors remain readable in LTR contexts.

External source text is not translated through AI or a paid translation API. Arabic summaries are generated locally from structured fields and deterministic rules.

## Themes

Dark mode is the default. Light mode and system mode are available from Settings and stored in localStorage.

## Responsive Design

The UI is designed for:

- Mobile phones
- Tablets
- Laptops
- Desktops
- Large screens
- Ultrawide screens

Navigation collapses on small screens, tables use responsive card/table behavior, filters remain usable, and charts resize inside their containers.

Target visual widths:

- 360px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

## LocalStorage Preferences

The app stores:

- Language
- Theme
- Dashboard cards
- Saved filters
- Default filters
- Vendor watchlist
- Product watchlist
- Keyword watchlist

## Excluded Features

This project intentionally excludes:

- AI APIs
- AI summaries
- AI translation
- Chatbot
- Backend server
- Database
- Telegram alerts
- Discord alerts
- Slack alerts
- Browser notifications
- Push notifications
- Email digest
- Webhook-based alerting

## Limitations

- Data freshness depends on GitHub scheduled workflow timing and source availability.
- RSS summaries vary by source quality.
- Vendor/product detection is deterministic keyword and CPE matching, not AI.
- Priority scoring is deterministic guidance, not a replacement for asset exposure validation.
- GitHub Pages serves the latest committed JSON, not live server-side data.

## Future Improvements

- MITRE ATT&CK mapping
- Threat actor tracking
- IOC extraction
- Optional scheduled CSV reports
- Optional user accounts if a backend is added later
- Custom source configuration
- Optional AI summaries or alert integrations in a future non-static version
