<?php
require_once __DIR__ . '/lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$body = json_decode(file_get_contents('php://input'), true);
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (!$email || !$password) json_error('Email and password required');

// Constant-time email check + password verify (always run verify to avoid timing leaks)
$emailOk = hash_equals(strtolower(ADMIN_EMAIL), $email);
$passOk = password_verify($password, ADMIN_PASSWORD_HASH);

if (!$emailOk || !$passOk) {
  // small delay to slow brute force
  usleep(400000);
  json_error('Invalid credentials', 401);
}

$token = jwt_sign([
  'sub' => $email,
  'iat' => time(),
  'exp' => time() + 60 * 60 * 8, // 8 hours
]);

json_response(['token' => $token]);
