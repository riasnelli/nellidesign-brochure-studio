<?php
// =====================================================================
//  GatewayHub secrets — SERVER-ONLY FILE
// =====================================================================
// COPY this file to `secrets.php` on the server (public_html/api/secrets.php)
// and fill in the real values. This file is NOT included in the Vite build,
// so re-uploading dist/ will never overwrite it.
//
// Alternatively, set the same values as environment variables in hPanel:
//   GATEWAYHUB_ADMIN_EMAIL
//   GATEWAYHUB_ADMIN_PASSWORD_HASH
//   GATEWAYHUB_JWT_SECRET
// Env vars take precedence over constants defined here.
// =====================================================================

// Refuse to be requested directly from the browser.
if (!defined('GATEWAYHUB_INTERNAL')) {
  http_response_code(403);
  exit('Forbidden');
}

// Admin login email
define('ADMIN_EMAIL', 'hello@nellidesigns.com');

// bcrypt hash of the admin password. Generate a new one with:
//   php -r "echo password_hash('YourNewPassword', PASSWORD_BCRYPT);"
define('ADMIN_PASSWORD_HASH', '$2y$12$REPLACE_ME_WITH_REAL_BCRYPT_HASH..............................');

// JWT signing secret. Generate with:
//   php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'REPLACE_ME_WITH_64_HEX_CHARS');

// ----- Contact form (public/api/contact.php) -----
// Google reCAPTCHA v2 secret key (https://www.google.com/recaptcha/admin)
define('RECAPTCHA_SECRET', 'REPLACE_ME_WITH_RECAPTCHA_V2_SECRET');
putenv('RECAPTCHA_SECRET=REPLACE_ME_WITH_RECAPTCHA_V2_SECRET');
// Where enquiries are delivered (defaults to hello@nellidesign.com)
define('CONTACT_TO_EMAIL', 'hello@nellidesign.com');
putenv('CONTACT_TO_EMAIL=hello@nellidesign.com');
