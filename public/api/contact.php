<?php
// =====================================================================
//  Contact form endpoint — sends enquiries to hello@nellidesign.com
// =====================================================================
//  Required env vars (set in Hostinger hPanel or api/secrets.php):
//    RECAPTCHA_SECRET   – Google reCAPTCHA v2 secret key
//  Optional env vars:
//    CONTACT_TO_EMAIL   – recipient (defaults to hello@nellidesign.com)
//    CONTACT_FROM_EMAIL – From: header (defaults to no-reply@<host>)
// =====================================================================

if (!defined('GATEWAYHUB_INTERNAL')) define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/config.php';

// CORS / method guard
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

function _resp($data, int $code = 200) {
  http_response_code($code);
  echo json_encode($data);
  exit;
}

// --- Parse JSON body ---
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) _resp(['error' => 'Invalid request'], 400);

// --- Honeypot: bots happily fill every field ---
$honey = trim((string)($body['company_website'] ?? ''));
if ($honey !== '') {
  // Pretend success so the bot doesn't retry.
  _resp(['ok' => true]);
}

// --- Soft rate-limit: must spend at least 2s on the form ---
$startedAt = (int)($body['startedAt'] ?? 0);
if ($startedAt > 0) {
  $elapsedMs = (int)round(microtime(true) * 1000) - $startedAt;
  if ($elapsedMs < 1500) _resp(['ok' => true]); // looks automated
}

// --- Validate fields ---
$name        = trim((string)($body['name'] ?? ''));
$email       = trim((string)($body['email'] ?? ''));
$brochureType= trim((string)($body['brochureType'] ?? ''));
$pages       = trim((string)($body['pages'] ?? ''));
$budget      = trim((string)($body['budget'] ?? ''));
$timeline    = trim((string)($body['timeline'] ?? ''));
$project     = trim((string)($body['project'] ?? ''));
$token       = trim((string)($body['recaptchaToken'] ?? ''));

if ($name === '' || mb_strlen($name) > 100)   _resp(['error' => 'Name is required'], 400);
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255)
  _resp(['error' => 'Valid email is required'], 400);
if ($project === '' || mb_strlen($project) > 1000) _resp(['error' => 'Tell me about your project'], 400);
foreach ([[$brochureType,100],[$pages,20],[$budget,50],[$timeline,50]] as [$v,$max]) {
  if (mb_strlen($v) > $max) _resp(['error' => 'One of the fields is too long'], 400);
}

// --- Block obvious header-injection attempts in the email field ---
if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $name)) {
  _resp(['error' => 'Invalid input'], 400);
}

// --- Verify reCAPTCHA v2 ---
$secret = $__env('RECAPTCHA_SECRET', '');
if ($secret === '') _resp(['error' => 'Server not configured: missing RECAPTCHA_SECRET'], 500);
if ($token === '') _resp(['error' => 'Please complete the captcha'], 400);

$verify = @file_get_contents(
  'https://www.google.com/recaptcha/api/siteverify',
  false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
    'content' => http_build_query([
      'secret'   => $secret,
      'response' => $token,
      'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]),
    'timeout' => 8,
  ]])
);
$vr = $verify ? json_decode($verify, true) : null;
if (!is_array($vr) || empty($vr['success'])) {
  _resp(['error' => 'Captcha verification failed'], 400);
}

// --- Build email ---
$to   = $__env('CONTACT_TO_EMAIL', 'hello@nellidesign.com');
$host = $_SERVER['HTTP_HOST'] ?? 'nellidesign.com';
$from = $__env('CONTACT_FROM_EMAIL', 'no-reply@' . preg_replace('/^www\./', '', $host));

$subject = 'New brochure enquiry — ' . $name;

$lines = [
  'New enquiry from the NelliDESiGN website',
  '----------------------------------------',
  'Name:           ' . $name,
  'Email:          ' . $email,
  'Brochure type:  ' . ($brochureType ?: '—'),
  'Pages:          ' . ($pages ?: '—'),
  'Budget:         ' . ($budget ?: '—'),
  'Timeline:       ' . ($timeline ?: '—'),
  '',
  'Project details:',
  $project,
  '',
  '----------------------------------------',
  'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC',
  'IP:        ' . ($_SERVER['REMOTE_ADDR'] ?? '?'),
];
$message = implode("\r\n", $lines);

$headers = [
  'From: NelliDESiGN Website <' . $from . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'X-Mailer: PHP/' . phpversion(),
  'Content-Type: text/plain; charset=UTF-8',
  'MIME-Version: 1.0',
];

$ok = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));
if (!$ok) _resp(['error' => 'Could not send email. Please try WhatsApp.'], 500);

_resp(['ok' => true]);
