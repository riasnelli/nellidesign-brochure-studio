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
    brochures.json        <-- written by the admin panel
    settings.json         <-- written by the admin panel (nav position)
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
2. Upload `dist/` to `public_html/`, excluding `brochures/` (live data).
3. `api/config.php` is now generic and safe to overwrite.
4. `api/secrets.php` is never in the build, so it survives every deploy.
