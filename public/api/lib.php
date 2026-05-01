<?php
// Internal-only entrypoint marker. config.php and lib.php both check this
// constant and refuse to run if the file is requested directly via the web.
if (!defined('GATEWAYHUB_INTERNAL')) define('GATEWAYHUB_INTERNAL', true);

require_once __DIR__ . '/config.php';

function json_response($data, int $status = 200) {
  http_response_code($status);
  echo json_encode($data);
  exit;
}

function json_error(string $msg, int $status = 400) {
  json_response(['error' => $msg], $status);
}

// --- Tiny JWT (HS256) ---
function b64url(string $s): string {
  return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}
function b64url_decode(string $s): string {
  $pad = strlen($s) % 4;
  if ($pad) $s .= str_repeat('=', 4 - $pad);
  return base64_decode(strtr($s, '-_', '+/'));
}
function jwt_sign(array $payload): string {
  $header = ['alg' => 'HS256', 'typ' => 'JWT'];
  $h = b64url(json_encode($header));
  $p = b64url(json_encode($payload));
  $sig = b64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
  return "$h.$p.$sig";
}
function jwt_verify(string $token): ?array {
  $parts = explode('.', $token);
  if (count($parts) !== 3) return null;
  [$h, $p, $sig] = $parts;
  $expected = b64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
  if (!hash_equals($expected, $sig)) return null;
  $payload = json_decode(b64url_decode($p), true);
  if (!is_array($payload)) return null;
  if (isset($payload['exp']) && $payload['exp'] < time()) return null;
  return $payload;
}

function get_header(string $name): string {
  $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
  if (!empty($_SERVER[$key])) return $_SERVER[$key];
  if (function_exists('getallheaders')) {
    foreach (getallheaders() as $k => $v) {
      if (strcasecmp($k, $name) === 0) return $v;
    }
  }
  return '';
}

function require_auth(): array {
  $hdr = get_header('Authorization');
  if (!preg_match('/Bearer\s+(.+)/', $hdr, $m)) json_error('Unauthorized', 401);
  $payload = jwt_verify(trim($m[1]));
  if (!$payload) json_error('Invalid or expired token', 401);
  return $payload;
}

// ---- CSRF: Origin/Referer host check (defence-in-depth even with Bearer auth) ----
function host_of(string $url): string {
  $u = parse_url($url);
  return strtolower($u['host'] ?? '');
}
function require_same_origin(): void {
  $origin = get_header('Origin');
  $referer = get_header('Referer');
  $allowed = array_map('strtolower', ALLOWED_ORIGINS);
  $suffixes = defined('ALLOWED_ORIGIN_SUFFIXES') ? array_map('strtolower', ALLOWED_ORIGIN_SUFFIXES) : [];
  $okHost = function(string $h) use ($allowed, $suffixes): bool {
    if ($h === '') return false;
    if (in_array($h, $allowed, true)) return true;
    foreach ($suffixes as $suf) {
      if ($suf !== '' && substr($h, -strlen($suf)) === $suf) return true;
    }
    return false;
  };
  $oh = $origin ? host_of($origin) : '';
  $rh = $referer ? host_of($referer) : '';
  // Need at least one of Origin/Referer; any present one must match.
  if ($oh === '' && $rh === '') json_error('Forbidden origin', 403);
  if ($oh !== '' && !$okHost($oh)) json_error('Forbidden origin', 403);
  if ($rh !== '' && !$okHost($rh)) json_error('Forbidden origin', 403);
}

// ---- CSRF: double-submit token bound to the JWT ----
// The CSRF token is HMAC(JWT_SECRET, jti). It's returned to the client at
// login time and must be echoed back as X-CSRF-Token on every write request.
function csrf_for(string $jti): string {
  return b64url(hash_hmac('sha256', 'csrf:' . $jti, JWT_SECRET, true));
}
function require_csrf(array $jwtPayload): void {
  $jti = $jwtPayload['jti'] ?? '';
  if (!$jti) json_error('CSRF token missing (no jti)', 403);
  $sent = trim(get_header('X-CSRF-Token'));
  if ($sent === '') json_error('CSRF token missing', 403);
  $expected = csrf_for($jti);
  if (!hash_equals($expected, $sent)) json_error('CSRF token invalid', 403);
}

// ---- Slug + path helpers ----
function safe_slug(string $s): string {
  $s = strtolower(trim($s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  $s = trim($s, '-');
  return $s;
}

function ensure_dir(string $path) {
  if (!is_dir($path)) mkdir($path, 0755, true);
}

// ---- brochures.json read/write ----
function read_brochures(): array {
  if (!file_exists(BROCHURES_JSON)) {
    $items = [];
    if (is_dir(BROCHURES_DIR)) {
      foreach (scandir(BROCHURES_DIR) as $entry) {
        if ($entry === '.' || $entry === '..') continue;
        $dir = BROCHURES_DIR . '/' . $entry;
        if (!is_dir($dir)) continue;
        $thumb = null;
        foreach (['thumbnail.jpg', 'thumbnail.png', 'thumbnail.webp'] as $t) {
          if (file_exists("$dir/$t")) { $thumb = $t; break; }
        }
        if (!$thumb) continue;
        $items[] = [
          'slug' => $entry,
          'title' => ucwords(str_replace('-', ' ', $entry)),
          'category' => 'Brochure',
          'thumbnail' => BROCHURES_PUBLIC_PATH . "/$entry/$thumb",
          'pdf' => BROCHURES_PUBLIC_PATH . "/$entry/file.pdf",
          'order' => count($items),
        ];
      }
    }
    return $items;
  }
  $raw = file_get_contents(BROCHURES_JSON);
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function write_brochures(array $items): void {
  ensure_dir(BROCHURES_DIR);
  $i = 0;
  foreach ($items as &$it) { $it['order'] = $i++; }
  file_put_contents(BROCHURES_JSON, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function find_idx(array $items, string $slug): int {
  foreach ($items as $i => $it) if (($it['slug'] ?? '') === $slug) return $i;
  return -1;
}
