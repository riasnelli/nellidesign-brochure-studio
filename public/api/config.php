<?php
// =====================================================================
//  GatewayHub configuration (NO SECRETS IN THIS FILE)
// =====================================================================
// This file is safe to overwrite on every deploy. All secrets are loaded
// from environment variables, with a fallback to /api/secrets.php which
// lives ONLY on the server (never in the repo, never in the build).
//
// On Hostinger, set secrets via either:
//   1. hPanel → Advanced → PHP Configuration → Environment variables, OR
//   2. Create public_html/api/secrets.php from secrets.example.php
//      (recommended — survives every redeploy because it is not in dist/)
// =====================================================================

// Hardening: refuse to be loaded directly from a browser
if (!defined('GATEWAYHUB_INTERNAL')) {
  http_response_code(403);
  exit('Forbidden');
}

// ---- Load secrets from server-only file (never shipped in build) ----
$__secretsFile = __DIR__ . '/secrets.php';
if (is_file($__secretsFile)) {
  require_once $__secretsFile;
}

// ---- Resolve secrets: env var first, then secrets.php constant ----
$__env = function (string $name, ?string $default = null): ?string {
  $v = getenv($name);
  if ($v !== false && $v !== '') return $v;
  return $default;
};

if (!defined('ADMIN_EMAIL')) {
  define('ADMIN_EMAIL', $__env('GATEWAYHUB_ADMIN_EMAIL', ''));
}
if (!defined('ADMIN_PASSWORD_HASH')) {
  define('ADMIN_PASSWORD_HASH', $__env('GATEWAYHUB_ADMIN_PASSWORD_HASH', ''));
}
if (!defined('JWT_SECRET')) {
  define('JWT_SECRET', $__env('GATEWAYHUB_JWT_SECRET', ''));
}

// Fail closed if anything critical is missing — better a clear error than
// a silently insecure deploy.
if (ADMIN_EMAIL === '' || ADMIN_PASSWORD_HASH === '' || JWT_SECRET === '' || JWT_SECRET === 'CHANGE-ME') {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Server not configured: missing GATEWAYHUB_* secrets. See public/api/secrets.example.php.']);
  exit;
}

// ---- Non-secret config (safe in repo) ----
define('ALLOWED_ORIGINS', [
  'nellidesigns.com',
  'www.nellidesigns.com',
  'brochuredesign.pro',
  'www.brochuredesign.pro',
  'localhost',
  '127.0.0.1',
]);

define('ALLOWED_ORIGIN_SUFFIXES', [
  '.lovable.app',
  '.lovableproject.com',
  '.lovable.dev',
]);

define('BROCHURES_DIR', __DIR__ . '/../brochures');
define('BROCHURES_PUBLIC_PATH', '/brochures');
define('BROCHURES_JSON', BROCHURES_DIR . '/brochures.json');

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
