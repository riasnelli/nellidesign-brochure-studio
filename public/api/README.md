# GatewayHub — PHP backend for Hostinger

Ships inside the Vite build. After `npm run build`, copy `dist/*` into `public_html/` on Hostinger. The `api/` folder lands at `public_html/api/` and brochures at `public_html/brochures/`.

## Pre-set credentials (CHANGE on first login)

- **Email:** `hello@nellidesigns.com`
- **Temporary password:** `W95d&m#PmNXAGs*K`

After your first login, immediately rotate the password:

```bash
php -r "echo password_hash('YourNewStrongPassword', PASSWORD_BCRYPT);"
```

Paste the output into `ADMIN_PASSWORD_HASH` in `public_html/api/config.php`.

## One-time setup on Hostinger

1. **Rotate `JWT_SECRET`** in `config.php` (the bundled value is a placeholder):
   ```bash
   php -r "echo bin2hex(random_bytes(32));"
   ```
2. **Add your domain** to `ALLOWED_ORIGINS` in `config.php` if it's not already there.
3. **Enable free SSL** in hPanel — the JWT lives in `localStorage` and must travel only over HTTPS.
4. Make sure `public_html/brochures/` is writable (chmod 755). The API will create it on first upload if missing.

## Security hardening summary

| Layer | What it does |
|---|---|
| `GATEWAYHUB_INTERNAL` constant | `config.php` and `lib.php` refuse to run if requested directly via the browser. |
| `.htaccess` `<FilesMatch>` | Apache also denies `config.php`, `lib.php`, dotfiles and backups at the web-server level. |
| `Options -Indexes` | Disables directory listings under `/api/`. |
| Bearer JWT (HS256) | Required on every admin write. 8-hour expiry, signed with `JWT_SECRET`. |
| Origin/Referer allowlist | Writes are rejected if neither header matches `ALLOWED_ORIGINS` (blocks cross-site form posts). |
| Double-submit CSRF token | Login returns `csrfToken = HMAC(JWT_SECRET, jti)`. The frontend echoes it as `X-CSRF-Token` on every write — verified server-side with `hash_equals`. |
| Constant-time login | Email + password compared with `hash_equals` / `password_verify`, plus 400 ms delay on failure. |
| Upload validation | Whitelisted extensions (PDF, JPG/PNG/WEBP), 50 MB max, files renamed to `file.pdf` / `thumbnail.<ext>`. |
| Auto-logout on auth failure | Frontend clears token + CSRF on any 401/403, bouncing back to `/gatewayhub`. |
| Security headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` set in PHP and `.htaccess`. |

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/login.php` | — | `{ email, password }` → `{ token, csrfToken, expiresIn }` |
| GET | `/api/brochures.php` | — | Public list |
| POST | `/api/brochures.php?action=create` | Bearer + `X-CSRF-Token` | multipart |
| POST | `/api/brochures.php?action=update&slug=...` | Bearer + `X-CSRF-Token` | multipart |
| POST | `/api/brochures.php?action=delete&slug=...` | Bearer + `X-CSRF-Token` | — |
| POST | `/api/brochures.php?action=reorder` | Bearer + `X-CSRF-Token` | `{ slugs: [] }` |

Every write also requires `Origin` or `Referer` to match a host in `ALLOWED_ORIGINS`.
