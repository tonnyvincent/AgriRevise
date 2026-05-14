<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    agrirevise_error('Use POST for this endpoint.', 405);
}

$input = agrirevise_input();
$name = isset($input['name']) ? $input['name'] : '';
$game = isset($input['game']) ? $input['game'] : '';
$score = isset($input['score']) ? $input['score'] : 0;
$pdo = agrirevise_pdo();
$player = agrirevise_save_score($pdo, $name, $game, $score);

agrirevise_json(array(
    'ok' => true,
    'player' => $player,
));
