# GatewayHub — PHP backend for Hostinger

This folder ships as part of your Vite build. After `npm run build`, copy the contents of `dist/` to `public_html/` on Hostinger. The `api/` folder will sit at `public_html/api/` and the brochure files at `public_html/brochures/`.

## One-time setup on Hostinger

1. Open `public_html/api/config.php` (use hPanel → File Manager → Edit).
2. Set `ADMIN_EMAIL` to your email.
3. Generate a password hash. In hPanel → Advanced → SSH or via any local PHP:
   ```
   php -r "echo password_hash('YourStrongPassword', PASSWORD_BCRYPT);"
   ```
   Paste the output into `ADMIN_PASSWORD_HASH`.
4. Generate a JWT secret:
   ```
   php -r "echo bin2hex(random_bytes(32));"
   ```
   Paste it into `JWT_SECRET`.
5. Make sure `public_html/brochures/` exists and is writable (chmod 755). If not, the API will create it on the first upload.

## How it works

- Frontend calls `/api/login.php` to sign in (returns a JWT, stored in `localStorage`).
- Admin panel at `/gatewayhub/admin` calls `/api/brochures.php` to list/create/update/delete/reorder.
- Every write regenerates `public_html/brochures/brochures.json`.
- The public site (`Projects.tsx`) loads `/brochures/brochures.json` and falls back to the bundled list if that file is missing.

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/login.php` | — | `{ email, password }` → `{ token }` |
| GET | `/api/brochures.php` | — | List (public) |
| POST | `/api/brochures.php?action=create` | Bearer | multipart: title, category, slug?, thumbnail, pdf |
| POST | `/api/brochures.php?action=update&slug=...` | Bearer | multipart: any field optional |
| POST | `/api/brochures.php?action=delete&slug=...` | Bearer | removes folder + JSON entry |
| POST | `/api/brochures.php?action=reorder` | Bearer | JSON: `{ slugs: [] }` |

## Security notes

- Single admin only. Tokens expire after 8 hours.
- Uploads are restricted to PDF and JPG/PNG/WEBP, 50MB max.
- `config.php` and `lib.php` are blocked from direct browser access via `.htaccess`.
- Use HTTPS in Hostinger (free SSL via hPanel) — JWT in `localStorage` should never travel over plain HTTP.
