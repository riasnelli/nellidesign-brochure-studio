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

function _log_enquiry(array $entry) {
  $logDir = __DIR__ . '/logs';
  if (!is_dir($logDir)) @mkdir($logDir, 0755, true);
  // Protect against direct web access
  $ht = $logDir . '/.htaccess';
  if (!file_exists($ht)) @file_put_contents($ht, "Require all denied\nDeny from all\n");
  $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  @file_put_contents($logDir . '/enquiries.log', $line . "\n", FILE_APPEND | LOCK_EX);
}

$__log = [
  'ts'             => gmdate('Y-m-d\TH:i:s\Z'),
  'ip'             => $_SERVER['REMOTE_ADDR'] ?? null,
  'ua'             => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 250),
  'recaptcha'      => 'skipped',
  'email_delivery' => 'not_attempted',
];

register_shutdown_function(function () use (&$__log) {
  _log_enquiry($__log);
});

// --- Parse JSON body ---
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) _resp(['error' => 'Invalid request'], 400);

// --- Honeypot: bots happily fill every field ---
$honey = trim((string)($body['company_website'] ?? ''));
if ($honey !== '') {
  $__log['result'] = 'honeypot_triggered';
  // Pretend success so the bot doesn't retry.
  _resp(['ok' => true]);
}

// --- Soft rate-limit: must spend at least 2s on the form ---
$startedAt = (int)($body['startedAt'] ?? 0);
if ($startedAt > 0) {
  $elapsedMs = (int)round(microtime(true) * 1000) - $startedAt;
  if ($elapsedMs < 1500) {
    $__log['result'] = 'rate_limited';
    $__log['elapsed_ms'] = $elapsedMs;
    _resp(['ok' => true]); // looks automated
  }
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

$__log['name']  = $name;
$__log['email'] = $email;

if ($name === '' || mb_strlen($name) > 100)   { $__log['result'] = 'validation_failed:name'; _resp(['error' => 'Name is required'], 400); }
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
  $__log['result'] = 'validation_failed:email'; _resp(['error' => 'Valid email is required'], 400);
}
if ($project === '' || mb_strlen($project) > 1000) { $__log['result'] = 'validation_failed:project'; _resp(['error' => 'Tell me about your project'], 400); }
foreach ([[$brochureType,100],[$pages,20],[$budget,50],[$timeline,50]] as [$v,$max]) {
  if (mb_strlen($v) > $max) { $__log['result'] = 'validation_failed:length'; _resp(['error' => 'One of the fields is too long'], 400); }
}

// --- Block obvious header-injection attempts in the email field ---
if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $name)) {
  $__log['result'] = 'validation_failed:injection';
  _resp(['error' => 'Invalid input'], 400);
}

// --- Verify reCAPTCHA v2 ---
$secret = $__env('RECAPTCHA_SECRET', '');
if ($secret === '' && defined('RECAPTCHA_SECRET')) $secret = (string)constant('RECAPTCHA_SECRET');
if ($secret !== '') {
  if ($token === '') { $__log['recaptcha'] = 'missing_token'; _resp(['error' => 'Please complete the captcha'], 400); }

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
    $__log['recaptcha'] = 'failed';
    $__log['recaptcha_errors'] = is_array($vr) ? ($vr['error-codes'] ?? null) : 'no_response';
    _resp(['error' => 'Captcha verification failed'], 400);
  }
  $__log['recaptcha'] = 'verified';
} else {
  $__log['recaptcha'] = 'no_secret_configured';
}

// --- Build email ---
$to   = $__env('CONTACT_TO_EMAIL', defined('CONTACT_TO_EMAIL') ? (string)constant('CONTACT_TO_EMAIL') : 'hello@nellidesign.com');
$host = $_SERVER['HTTP_HOST'] ?? 'nellidesign.com';
$from = $__env('CONTACT_FROM_EMAIL', 'no-reply@' . preg_replace('/^www\./', '', $host));

$subject = 'New brochure enquiry — ' . $name;

$lines = [
  'New enquiry from the BrochureDesign.Pro website',
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
  'From: BrochureDesign.Pro Website <' . $from . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'X-Mailer: PHP/' . phpversion(),
  'Content-Type: text/plain; charset=UTF-8',
  'MIME-Version: 1.0',
];

$__log['mail_to']   = $to;
$__log['mail_from'] = $from;

$ok = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));
if (!$ok) {
  $err = error_get_last();
  $__log['email_delivery'] = 'failed';
  $__log['mail_error'] = $err['message'] ?? null;
  _resp(['error' => 'Could not send email. Please try WhatsApp.'], 500);
}

$__log['email_delivery'] = 'sent';
$__log['result'] = 'ok';
_resp(['ok' => true]);
