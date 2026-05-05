<?php
define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/lib.php';

$SETTINGS_FILE = BROCHURES_SETTINGS_JSON;

function read_settings(string $file): array {
  migrate_legacy_brochures();
  $defaults = ['navPosition' => 'top'];
  if (!file_exists($file)) return $defaults;
  $raw = file_get_contents($file);
  $data = json_decode($raw, true);
  if (!is_array($data)) return $defaults;
  return array_merge($defaults, $data);
}

function write_settings(string $file, array $data): void {
  $dir = dirname($file);
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  json_response(read_settings($SETTINGS_FILE));
}

if ($method !== 'POST') json_error('Method not allowed', 405);

require_same_origin();
$jwtPayload = require_auth();
require_csrf($jwtPayload);

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) json_error('Invalid body');

$current = read_settings($SETTINGS_FILE);

if (isset($body['navPosition'])) {
  $v = $body['navPosition'];
  if (!in_array($v, ['top', 'bottom'], true)) json_error('navPosition must be "top" or "bottom"');
  $current['navPosition'] = $v;
}

write_settings($SETTINGS_FILE, $current);
json_response($current);
