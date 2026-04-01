<?php
// ================================================
// StudyUp – Giriş (Login) Endpoint
// php/login.php
// ================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Geçersiz istek metodu.');
}

$input    = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$email    = trim($input['email']    ?? '');
$password = $input['password']      ?? '';

if (!$email || !$password) {
    jsonResponse(false, '⚠️ E-posta ve şifre boş bırakılamaz.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, '⚠️ Geçerli bir e-posta adresi girin.');
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id, ad, soyad, email, password_hash FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(false, '⚠️ E-posta veya şifre hatalı.');
}

// Oturum aç
$_SESSION['user_id']   = $user['id'];
$_SESSION['user_name'] = $user['ad'] . ' ' . $user['soyad'];
$_SESSION['user_email']= $user['email'];

jsonResponse(true, '✅ Giriş başarılı! Yönlendiriliyorsun...', [
    'name' => $user['ad'] . ' ' . $user['soyad']
]);
