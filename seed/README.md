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

When you upload a new build to Hostinger:

1. Build locally (`npm run build`).
2. Upload the contents of `dist/` to `public_html/`, **excluding**:
   - `brochures/`  (live data — never overwrite)
   - `api/config.php`  (contains your real password hash + JWT secret)
3. If `api/` files changed, upload only the changed ones — never overwrite
   `config.php`.

If you use FTP, set the sync rule to skip `brochures/` and `api/config.php`.
