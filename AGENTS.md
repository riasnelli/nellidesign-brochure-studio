# Project architecture

- Keep GatewayHub authentication on the existing Hostinger PHP API; prefer current `GATEWAYHUB_*` environment values over uploaded `api/secrets.php` constants so credential rotations in Hostinger take effect without editing deployed files.
- Serve admin-managed brochure media through the PHP file endpoint with short revalidation and source-specific resize caches because uploads can replace images at the same URL.
- Keep npm overrides for patched transitive dependency majors and maintain package-lock.json for the Hostinger `npm ci` deployment because upstream ranges may otherwise resolve to vulnerable versions.