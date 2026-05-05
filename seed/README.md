# Seed brochures

These are the original sample brochures. They are kept OUT of the Vite build
on purpose so deploying a new build never overwrites the live `brochures/`
folder on Hostinger.

## When to upload these

Only on a fresh Hostinger install where `public_html/brochures/` is empty.
Drag the contents of `seed/brochures/` into `public_html/brochures/` once,
then never touch them again — the admin panel manages everything from there.

## How the live data is organised

```
public_html/
  brochures/
    brochures.json        <-- legacy location; migrated automatically
    settings.json         <-- legacy location; migrated automatically
    <slug>/
      thumbnail.jpg
      file.pdf
```

## Safe-deploy checklist

Secrets now live in `public_html/api/secrets.php` (server-only, NOT in the
repo or build). `api/config.php` is safe to overwrite on every deploy.

One-time setup on Hostinger:

1. Copy `public/api/secrets.example.php` → `public_html/api/secrets.php`.
2. Edit it and fill in: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt),
   and `JWT_SECRET` (64 random hex chars).
3. (Optional alternative) Set env vars in hPanel instead:
   `GATEWAYHUB_ADMIN_EMAIL`, `GATEWAYHUB_ADMIN_PASSWORD_HASH`,
   `GATEWAYHUB_JWT_SECRET`. Env vars override constants.

On every redeploy:

1. Build locally (`npm run build`).
2. Upload `dist/` to `public_html/`. Live uploads are stored outside `public_html` in `gatewayhub-data/brochures/`, so deploys cannot wipe them.
3. `api/config.php` is now generic and safe to overwrite.
4. `api/secrets.php` is never in the build, so it survives every deploy.

## Auto-deploy from GitHub → Hostinger

A GitHub Actions workflow (`.github/workflows/deploy-hostinger.yml`) builds
the app and FTP-uploads `dist/` to Hostinger on every push to `main`.
Server-only paths (`brochures/`, `api/secrets.php`) are excluded so live
data and credentials are never overwritten.

### One-time GitHub setup

In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.
Add these four secrets:

| Secret | Value | Where to find it (hPanel) |
|---|---|---|
| `HOSTINGER_FTP_HOST` | e.g. `ftp.nellidesigns.com` | Files → FTP Accounts → Hostname |
| `HOSTINGER_FTP_USER` | e.g. `u123456789` | Files → FTP Accounts → Username |
| `HOSTINGER_FTP_PASSWORD` | your FTP password | Files → FTP Accounts (reset if unknown) |
| `HOSTINGER_FTP_DIR` | `/public_html/` | Trailing slash required |

That's it. Push to `main` → GitHub Actions builds → uploads to Hostinger →
live in ~2 minutes. Watch progress under the repo's **Actions** tab.

### What is NEVER touched by auto-deploy

- `gatewayhub-data/brochures/` — your live brochures and `brochures.json`
  (everything you add via the admin panel lives here and is preserved
  across every deploy)
- `public_html/api/secrets.php` — admin password hash + JWT secret
  (also in `.gitignore`, so it can't accidentally land in the repo)

### If admin-added brochures ever disappear after a deploy

It means the FTP exclude patterns didn't match. Verify in hPanel that
`public_html/brochures/` still exists and contains your slugs. If it was
wiped, restore from Hostinger's daily backup (Files → Backups), then
re-run the failed Actions job — the hardened excludes prevent recurrence.
