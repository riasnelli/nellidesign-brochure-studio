<?php
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

function require_auth(): array {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (!$hdr && function_exists('getallheaders')) {
    $h = getallheaders();
    $hdr = $h['Authorization'] ?? $h['authorization'] ?? '';
  }
  if (!preg_match('/Bearer\s+(.+)/', $hdr, $m)) json_error('Unauthorized', 401);
  $payload = jwt_verify(trim($m[1]));
  if (!$payload) json_error('Invalid or expired token', 401);
  return $payload;
}

// --- Slug + path helpers ---
function safe_slug(string $s): string {
  $s = strtolower(trim($s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s);
  $s = trim($s, '-');
  return $s;
}

function ensure_dir(string $path) {
  if (!is_dir($path)) mkdir($path, 0755, true);
}

// --- brochures.json read/write ---
function read_brochures(): array {
  if (!file_exists(BROCHURES_JSON)) {
    // Bootstrap from existing folders if present
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
  // Renumber order
  $i = 0;
  foreach ($items as &$it) { $it['order'] = $i++; }
  file_put_contents(BROCHURES_JSON, json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function find_idx(array $items, string $slug): int {
  foreach ($items as $i => $it) if (($it['slug'] ?? '') === $slug) return $i;
  return -1;
}
