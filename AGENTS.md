# Project architecture

- Keep GatewayHub authentication on the existing Hostinger PHP API; prefer current `GATEWAYHUB_*` environment values over uploaded `api/secrets.php` constants so credential rotations in Hostinger take effect without editing deployed files.
- Serve admin-managed brochure media through the PHP file endpoint with short revalidation and source-specific resize caches because uploads can replace images at the same URL.