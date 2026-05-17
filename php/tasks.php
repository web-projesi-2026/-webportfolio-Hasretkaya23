<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config.php';

$pdo = getPDO();

// Tablo oluştur
$pdo->exec("CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('bekliyor','devam','tamamlandi') DEFAULT 'bekliyor',
  priority ENUM('dusuk','orta','yuksek') DEFAULT 'orta',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// GET - Listele
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM tasks ORDER BY created_at DESC');
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

// POST - Ekle
if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    if (!$title) { echo json_encode(['success' => false, 'message' => 'Başlık zorunlu.']); exit; }
    $stmt = $pdo->prepare('INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $input['description'] ?? '', $input['status'] ?? 'bekliyor', $input['priority'] ?? 'orta']);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

// PUT - Güncelle
if ($method === 'PUT') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'message' => 'Geçersiz ID.']); exit; }
    $stmt = $pdo->prepare('UPDATE tasks SET title=?, description=?, status=?, priority=? WHERE id=?');
    $stmt->execute([$input['title'], $input['description'] ?? '', $input['status'] ?? 'bekliyor', $input['priority'] ?? 'orta', $id]);
    echo json_encode(['success' => true]);
    exit;
}

// DELETE - Sil
if ($method === 'DELETE') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) { echo json_encode(['success' => false, 'message' => 'Geçersiz ID.']); exit; }
    $pdo->prepare('DELETE FROM tasks WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Geçersiz istek.']);
