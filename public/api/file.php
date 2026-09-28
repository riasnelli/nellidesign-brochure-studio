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

// Optional on-the-fly resize for thumbnails: /api/file.php?...&w=600
// Caches the resized variant alongside the original. Only applies when GD is
// available and the original is an image larger than the requested width.
$reqW = isset($_GET['w']) ? (int)$_GET['w'] : 0;
$canResize = $ext !== 'pdf' && $reqW > 0 && $reqW <= 2000 && function_exists('imagecreatefromstring');
if ($canResize) {
    // Snap to a small set of sizes so the cache stays bounded.
    $sizes = [300, 400, 500, 700, 900, 1200];
    $target = $sizes[0];
  foreach ($sizes as $s) if ($reqW >= $s) $target = $s;

  $cacheDir = BROCHURES_DIR . "/$slug/.cache";
  if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
  // Include the source filename so replacing JPG with PNG cannot reuse the
  // previous thumbnail's cached WebP at the same requested width.
  $cachePath = "$cacheDir/thumb-" . strtolower($file) . "-$target.webp";

  if (!is_file($cachePath) || filemtime($cachePath) < filemtime($path)) {
    $raw = @file_get_contents($path);
    $src = $raw ? @imagecreatefromstring($raw) : false;
    if ($src) {
      $sw = imagesx($src); $sh = imagesy($src);
      if ($sw > $target) {
        $nw = $target; $nh = (int)round($sh * ($target / $sw));
        $dst = imagecreatetruecolor($nw, $nh);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $sw, $sh);
        if (function_exists('imagewebp')) {
          @imagewebp($dst, $cachePath, 82);
        }
        imagedestroy($dst);
      }
      imagedestroy($src);
    }
  }

  if (is_file($cachePath)) {
    header('Content-Type: image/webp');
    // Admin uploads replace images at the same URL, so these are not immutable.
    header('Cache-Control: public, max-age=300, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    header('Content-Length: ' . filesize($cachePath));
    readfile($cachePath);
    exit;
  }
}

header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: public, max-age=300, must-revalidate');
header('X-Content-Type-Options: nosniff');
header('Content-Length: ' . filesize($path));
readfile($path);
