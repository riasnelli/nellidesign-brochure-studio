<?php
define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/lib.php';

$slug = safe_slug($_GET['slug'] ?? '');
$file = basename($_GET['file'] ?? '');

if (!$slug || !preg_match('/^(thumbnail\.(jpe?g|png|webp)|file\.pdf)$/i', $file)) {
  http_response_code(404);
  exit;
}

migrate_legacy_brochures();

$path = BROCHURES_DIR . "/$slug/$file";
if (!is_file($path)) {
  http_response_code(404);
  exit;
}

$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$types = [
  'pdf' => 'application/pdf',
  'jpg' => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'png' => 'image/png',
  'webp' => 'image/webp',
];

header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . filesize($path));
readfile($path);