<?php
define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);
require_same_origin();

$body = json_decode(file_get_contents('php://input'), true);
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (!$email || !$password) json_error('Email and password required');

$emailOk = hash_equals(strtolower(ADMIN_EMAIL), $email);
$passOk = password_verify($password, ADMIN_PASSWORD_HASH);

if (!$emailOk || !$passOk) {
  usleep(400000); // slow brute force
  json_error('Invalid credentials', 401);
}

$jti = bin2hex(random_bytes(16));
$token = jwt_sign([
  'sub' => $email,
  'jti' => $jti,
  'iat' => time(),
  'exp' => time() + 60 * 60 * 8, // 8 hours
]);

json_response([
  'token' => $token,
  'csrfToken' => csrf_for($jti),
  'expiresIn' => 60 * 60 * 8,
]);
