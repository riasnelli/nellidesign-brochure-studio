<?php
define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Public read (no CSRF, no Origin check — list is public).
if ($method === 'GET') {
  json_response(read_brochures());
}

if ($method !== 'POST') json_error('Method not allowed', 405);

// All write paths: same-origin + Bearer JWT + double-submit CSRF token.
require_same_origin();
$jwtPayload = require_auth();
require_csrf($jwtPayload);

function save_upload(string $field, string $destDir, array $allowedExt): ?string {
  if (empty($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) return null;
  $f = $_FILES[$field];
  if ($f['error'] !== UPLOAD_ERR_OK) json_error("Upload failed for $field");
  if ($f['size'] > 50 * 1024 * 1024) json_error("$field too large (max 50MB)");
  $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowedExt, true)) json_error("$field: invalid file type");
  ensure_dir($destDir);
  $name = $field === 'pdf' ? "file.$ext" : "thumbnail.$ext";
  if ($field === 'thumbnail') {
    foreach (['jpg','jpeg','png','webp'] as $e) {
      $old = "$destDir/thumbnail.$e";
      if (file_exists($old) && $old !== "$destDir/$name") @unlink($old);
    }
  }
  if (!move_uploaded_file($f['tmp_name'], "$destDir/$name")) json_error("Could not save $field");
  return "$name";
}

$slug = safe_slug($_POST['slug'] ?? '');
$title = trim($_POST['title'] ?? '');
$category = trim($_POST['category'] ?? '');

if ($action === 'reorder') {
  $body = json_decode(file_get_contents('php://input'), true);
  $slugs = $body['slugs'] ?? [];
  if (!is_array($slugs)) json_error('slugs must be an array');
  $items = read_brochures();
  $bySlug = [];
  foreach ($items as $it) $bySlug[$it['slug']] = $it;
  $next = [];
  foreach ($slugs as $s) {
    $s = safe_slug($s);
    if (isset($bySlug[$s])) { $next[] = $bySlug[$s]; unset($bySlug[$s]); }
  }
  foreach ($bySlug as $it) $next[] = $it;
  write_brochures($next);
  json_response(['ok' => true]);
}

if ($action === 'create') {
  if (!$slug) $slug = safe_slug($title);
  if (!$slug || !$title || !$category) json_error('slug, title and category are required');
  $items = read_brochures();
  if (find_idx($items, $slug) !== -1) json_error('Slug already exists', 409);
  $dir = BROCHURES_DIR . "/$slug";
  ensure_dir($dir);
  $thumb = save_upload('thumbnail', $dir, ['jpg', 'jpeg', 'png', 'webp']);
  $pdf = save_upload('pdf', $dir, ['pdf']);
  if (!$thumb || !$pdf) json_error('Both thumbnail and PDF are required');
  $item = [
    'slug' => $slug,
    'title' => $title,
    'category' => $category,
    'thumbnail' => "/api/file.php?slug=$slug&file=$thumb",
    'pdf' => "/api/file.php?slug=$slug&file=file.pdf",
  ];
  $items[] = $item;
  write_brochures($items);
  json_response($item, 201);
}

if ($action === 'update') {
  $target = safe_slug($_GET['slug'] ?? '');
  if (!$target) json_error('slug required');
  $items = read_brochures();
  $i = find_idx($items, $target);
  if ($i === -1) json_error('Not found', 404);
  $dir = BROCHURES_DIR . "/$target";
  ensure_dir($dir);
  if ($title) $items[$i]['title'] = $title;
  if ($category) $items[$i]['category'] = $category;
  $thumb = save_upload('thumbnail', $dir, ['jpg', 'jpeg', 'png', 'webp']);
  if ($thumb) $items[$i]['thumbnail'] = "/api/file.php?slug=$target&file=$thumb";
  $pdf = save_upload('pdf', $dir, ['pdf']);
  if ($pdf) $items[$i]['pdf'] = "/api/file.php?slug=$target&file=$pdf";
  write_brochures($items);
  json_response($items[$i]);
}

if ($action === 'delete') {
  $target = safe_slug($_GET['slug'] ?? '');
  if (!$target) json_error('slug required');
  $items = read_brochures();
  $i = find_idx($items, $target);
  if ($i === -1) json_error('Not found', 404);
  $dir = BROCHURES_DIR . "/$target";
  if (is_dir($dir)) {
    foreach (scandir($dir) as $f) if ($f !== '.' && $f !== '..') @unlink("$dir/$f");
    @rmdir($dir);
  }
  array_splice($items, $i, 1);
  write_brochures($items);
  http_response_code(204);
  exit;
}

json_error('Unknown action', 400);
