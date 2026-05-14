<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    agrirevise_error('Use POST for this endpoint.', 405);
}

$input = agrirevise_input();
$name = isset($input['name']) ? $input['name'] : '';
$pdo = agrirevise_pdo();
$player = agrirevise_find_or_create_player($pdo, $name);

agrirevise_json(array(
    'ok' => true,
    'player' => $player,
));
