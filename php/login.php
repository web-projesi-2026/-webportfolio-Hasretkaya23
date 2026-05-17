<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Gecersiz istek metodu.']);
    exit;
}

$input    = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$email    = trim($input['email']    ?? '');
$password = $input['password']      ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'E-posta ve sifre bos birakilamaz.']);
    exit;
}

try {
    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT id, ad, soyad, email, password_hash FROM users WHERE email = ? AND password_hash = ? LIMIT 1');
    $stmt->execute([$email, $password]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'E-posta veya sifre hatali.']);
        exit;
    }

    $name = $user['ad'] . ' ' . $user['soyad'];
    echo json_encode(['success' => true, 'message' => 'Giris basarili!', 'name' => $name]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Sunucu hatasi: ' . $e->getMessage()]);
}
exit;