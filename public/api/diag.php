<?php
// =====================================================================
//  Diagnostic endpoint — confirms which secrets are present on the server.
//  SAFE: only returns booleans and string lengths, never the secret values.
//  Hit it at: https://nellidesigns.com/api/diag.php
//  Delete this file once everything is working if you want.
// =====================================================================

if (!defined('GATEWAYHUB_INTERNAL')) define('GATEWAYHUB_INTERNAL', true);
require_once __DIR__ . '/config.php';

$check = function (string $name) use ($__env): array {
  $env  = $__env($name, '');
  $cnst = defined($name) ? (string)constant($name) : '';
  $val  = $env !== '' ? $env : $cnst;
  return [
    'present'      => $val !== '',
    'length'       => strlen($val),
    'source'       => $env !== '' ? 'env' : ($cnst !== '' ? 'constant' : 'missing'),
  ];
};

echo json_encode([
  'php_version'      => PHP_VERSION,
  'mail_function'    => function_exists('mail'),
  'secrets_file'     => is_file(__DIR__ . '/secrets.php'),
  'secrets_file_mtime' => is_file(__DIR__ . '/secrets.php')
    ? gmdate('Y-m-d H:i:s', filemtime(__DIR__ . '/secrets.php')) . ' UTC'
    : null,
  'RECAPTCHA_SECRET' => $check('RECAPTCHA_SECRET'),
  'CONTACT_TO_EMAIL' => $check('CONTACT_TO_EMAIL'),
  'GATEWAYHUB_JWT_SECRET' => $check('GATEWAYHUB_JWT_SECRET'),
  'JWT_SECRET_const' => defined('JWT_SECRET') && constant('JWT_SECRET') !== '',
], JSON_PRETTY_PRINT);
