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
  // Hostinger/PHP-FPM can expose environment variables through different
  // channels depending on the account settings. Check all common sources so
  // GatewayHub keeps working even when api/secrets.php is not present.
  $values = [
    getenv($name),
    $_ENV[$name] ?? null,
    $_SERVER[$name] ?? null,
    $_SERVER['REDIRECT_' . $name] ?? null,
  ];

  foreach ($values as $v) {
    if (is_string($v) && trim($v) !== '') return trim($v);
  }

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

function gatewayhub_secrets_ready(): bool {
  return ADMIN_EMAIL !== '' && ADMIN_PASSWORD_HASH !== '' && JWT_SECRET !== '' && JWT_SECRET !== 'CHANGE-ME';
}

function require_gatewayhub_secrets(): void {
  if (gatewayhub_secrets_ready()) return;
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

// Store admin-managed portfolio files outside public_html so deploy syncs
// can never delete them. Override with GATEWAYHUB_DATA_ROOT if needed.
$__dataRoot = $__env('GATEWAYHUB_DATA_ROOT', dirname(__DIR__, 2) . '/gatewayhub-data');
define('GATEWAYHUB_DATA_ROOT', rtrim($__dataRoot, '/'));
define('BROCHURES_DIR', GATEWAYHUB_DATA_ROOT . '/brochures');
define('LEGACY_BROCHURES_DIR', __DIR__ . '/../brochures');
define('BROCHURES_JSON', BROCHURES_DIR . '/brochures.json');
define('BROCHURES_SETTINGS_JSON', BROCHURES_DIR . '/settings.json');

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
