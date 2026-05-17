<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Gecersiz istek metodu.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$ad    = trim($input['ad']    ?? '');
$soyad = trim($input['soyad'] ?? '');
$email = trim($input['email'] ?? '');
$pass  = $input['password']   ?? '';
$pass2 = $input['password2']  ?? '';

if (!$ad || !$soyad || !$email || !$pass || !$pass2) {
    echo json_encode(['success' => false, 'message' => 'Lutfen tum alanlari doldurun.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Gecerli bir e-posta adresi girin.']);
    exit;
}

if (strlen($pass) < 6) {
    echo json_encode(['success' => false, 'message' => 'Sifre en az 6 karakter olmalidir.']);
    exit;
}

if ($pass !== $pass2) {
    echo json_encode(['success' => false, 'message' => 'Sifreler eslesmıyor.']);
    exit;
}

try {
    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Bu e-posta zaten kayitli.']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO users (ad, soyad, email, password_hash) VALUES (?, ?, ?, ?)');
    $stmt->execute([$ad, $soyad, $email, $pass]);

    echo json_encode(['success' => true, 'message' => 'Hesabin olusturuldu! Giris sayfasina yonlendiriliyorsun...']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Sunucu hatasi: ' . $e->getMessage()]);
}
exit;