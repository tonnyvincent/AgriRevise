<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    agrirevise_error('Use GET for this endpoint.', 405);
}

$pdo = agrirevise_pdo();
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
$limit = max(1, min($limit, 100));
$game = isset($_GET['game']) ? agrirevise_normalize_game_key($_GET['game']) : '';
$meta = $game ? agrirevise_game_meta($game) : null;
$sortColumn = $meta ? '`' . $meta['column'] . '`' : '`total_score`';
$orderSql = $meta
    ? $sortColumn . ' DESC, `total_score` DESC, `updated_at` ASC'
    : '`total_score` DESC, `updated_at` ASC';

$sql = 'SELECT ' . agrirevise_select_columns()
    . ' FROM players'
    . ' ORDER BY ' . $orderSql
    . ' LIMIT ' . $limit;

$statement = $pdo->query($sql);
$players = array();

while ($row = $statement->fetch()) {
    $players[] = agrirevise_player_payload($row);
}

agrirevise_json(array(
    'ok' => true,
    'sort' => $meta ? $game : 'total',
    'players' => $players,
));
