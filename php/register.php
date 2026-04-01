<?php
// ================================================
// StudyUp – Kayıt (Register) Endpoint
// php/register.php
// ================================================

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Geçersiz istek metodu.');
}

// Gelen veriyi al
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST; // form-data fallback
}

$ad      = trim($input['ad']     ?? '');
$soyad   = trim($input['soyad']  ?? '');
$email   = trim($input['email']  ?? '');
$pass    = $input['password']    ?? '';
$pass2   = $input['password2']   ?? '';
$seviye  = trim($input['egitim_seviye'] ?? '');
$program = trim($input['program']       ?? '');
$bolum   = trim($input['bolum']         ?? '');
$sinif   = trim($input['sinif']         ?? '');

// --- Doğrulama ---
if (!$ad || !$soyad || !$email || !$pass || !$pass2) {
    jsonResponse(false, '⚠️ Lütfen tüm zorunlu alanları doldurun.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, '⚠️ Geçerli bir e-posta adresi girin.');
}

if (strlen($pass) < 6) {
    jsonResponse(false, '⚠️ Şifre en az 6 karakter olmalıdır.');
}

if ($pass !== $pass2) {
    jsonResponse(false, '⚠️ Şifreler eşleşmiyor.');
}

if ($seviye === 'uni' && (!$program || !$bolum)) {
    jsonResponse(false, '⚠️ Lütfen program türü ve bölüm seçin.');
}

// --- E-posta benzersizlik kontrolü ---
$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(false, '⚠️ Bu e-posta adresi zaten kayıtlı.');
}

// --- Kullanıcı oluştur ---
$hash = password_hash($pass, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('
    INSERT INTO users (ad, soyad, email, password_hash, egitim_seviye, program, bolum, sinif)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
');
$stmt->execute([$ad, $soyad, $email, $hash, $seviye ?: null, $program ?: null, $bolum ?: null, $sinif ?: null]);

jsonResponse(true, '🎉 Hesabın oluşturuldu! Giriş sayfasına yönlendiriliyorsun...');
