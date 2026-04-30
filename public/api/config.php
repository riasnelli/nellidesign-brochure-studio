<?php
// =====================================================================
//  GatewayHub admin credentials
// =====================================================================
// Email
define('ADMIN_EMAIL', 'hello@nellidesigns.com');

// Temporary password (CHANGE IT after first login by editing this file):
//   Plain:  W95d&m#PmNXAGs*K
// To rotate the password later, generate a new bcrypt hash with:
//   php -r "echo password_hash('YourNewPassword', PASSWORD_BCRYPT);"
define('ADMIN_PASSWORD_HASH', '$2y$12$wfvUbKeuKpuSic3aGj/c0OEkAh4VTTMR3M/h/k3fb2QRR5eO3UN56');

// JWT signing secret. REPLACE this on Hostinger with a fresh random string:
//   php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'CHANGE-ME-on-hostinger-to-a-64char-random-hex-string-please-rotate');

// Allowed Origin / Referer hosts for admin write requests.
// Add your production hostnames here. Match is case-insensitive, host only.
define('ALLOWED_ORIGINS', [
  'nellidesigns.com',
  'www.nellidesigns.com',
  'localhost',
  '127.0.0.1',
]);

// Filesystem locations for brochures + JSON index
define('BROCHURES_DIR', __DIR__ . '/../brochures');
define('BROCHURES_PUBLIC_PATH', '/brochures');
define('BROCHURES_JSON', BROCHURES_DIR . '/brochures.json');

// Hardening: refuse to be loaded directly from a browser
if (!defined('GATEWAYHUB_INTERNAL')) {
  http_response_code(403);
  exit('Forbidden');
}

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
