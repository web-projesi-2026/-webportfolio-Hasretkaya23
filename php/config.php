<?php
// ================================================
// StudyUp – Veritabanı Yapılandırması
// php/config.php
// ================================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // XAMPP/WAMP varsayılanı
define('DB_PASS', '');           // XAMPP varsayılanı boş
define('DB_NAME', 'studyup');
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Veritabanı bağlantı hatası.']));
        }
    }
    return $pdo;
}

// JSON yanıt yardımcısı
function jsonResponse(bool $success, string $message, array $data = []): void {
    header('Content-Type: application/json');
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $data));
    exit;
}

// Oturum başlat
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
