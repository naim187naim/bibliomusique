<?php
header('Content-Type: application/json');

// Remplace 'root' et '' par tes identifiants MariaDB si besoin
$host = 'localhost';
$db   = 'music_db';
$user = 'root';
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = $_GET['query'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM songs WHERE title LIKE ? LIMIT 1");
    $stmt->execute(["%$query%"]);
    $song = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($song) {
        echo json_encode([
            'success' => true,
            'title'   => $song['title'],
            'file_path' => $song['file_path'],
            'lyrics'  => $song['lyrics'], // C'est déjà une chaîne JSON en DB
            'color_theme' => $song['color_theme']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Musique non trouvée']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
?>
