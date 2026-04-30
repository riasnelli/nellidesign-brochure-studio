<?php
// ---- EDIT THESE TWO LINES ----
// 1) Set your admin email
define('ADMIN_EMAIL', 'you@example.com');
// 2) Set your admin password hash. Generate with PHP:
//    php -r "echo password_hash('YourStrongPassword', PASSWORD_BCRYPT);"
define('ADMIN_PASSWORD_HASH', '$2y$10$REPLACE_WITH_OUTPUT_OF_password_hash_CALL');

// 3) Random 64+ char string. Generate with: php -r "echo bin2hex(random_bytes(32));"
define('JWT_SECRET', 'replace-with-a-long-random-string-please-change-me');

// Path on the Hostinger server where uploaded files live and the JSON index is written.
// Default: ../brochures relative to /api  ->  public_html/brochures
define('BROCHURES_DIR', __DIR__ . '/../brochures');
define('BROCHURES_PUBLIC_PATH', '/brochures'); // URL prefix served by the web server
define('BROCHURES_JSON', BROCHURES_DIR . '/brochures.json');

// CORS — same origin in production, no headers required. Uncomment if you ever serve API on a different domain.
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Headers: Content-Type, Authorization');
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

header('Content-Type: application/json');
