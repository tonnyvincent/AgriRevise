<?php

require_once __DIR__ . '/config.php';

$AGRIREVISE_GAME_MAP = array(
    'jenis_sifat_tanah' => array(
        'column' => 'score_jenis_sifat_tanah',
        'label' => 'Jenis dan Sifat Tanah',
        'max' => 15,
    ),
    'tanah_tapak_penanaman' => array(
        'column' => 'score_tanah_tapak_penanaman',
        'label' => 'Tanah di Tapak Penanaman',
        'max' => 10,
    ),
    'struktur_tanah' => array(
        'column' => 'score_struktur_tanah',
        'label' => 'Struktur Tanah',
        'max' => 11,
    ),
    'ph_tanah' => array(
        'column' => 'score_ph_tanah',
        'label' => 'pH Tanah',
        'max' => 12,
    ),
    'kaedah_memperbaiki_tanah' => array(
        'column' => 'score_kaedah_memperbaiki_tanah',
        'label' => 'Kaedah Memperbaiki Tanah',
        'max' => 10,
    ),
    'jenis_baja' => array(
        'column' => 'score_jenis_baja',
        'label' => 'Jenis Baja',
        'max' => 14,
    ),
    'pengiraan_kos_baja' => array(
        'column' => 'score_pengiraan_kos_baja',
        'label' => 'Pengiraan Kos Baja',
        'max' => 10,
    ),
);

function agrirevise_json($payload, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function agrirevise_error($message, $status = 400)
{
    agrirevise_json(array(
        'ok' => false,
        'error' => $message,
    ), $status);
}

function agrirevise_input()
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (is_array($data)) {
        return $data;
    }

    return $_POST;
}

function agrirevise_pdo()
{
    if (!agrirevise_database_is_configured()) {
        agrirevise_error('Database config is not set in api/config.php.', 503);
    }

    $dsn = 'mysql:host=' . AGRIREVISE_DB_HOST
        . ';dbname=' . AGRIREVISE_DB_NAME
        . ';charset=' . AGRIREVISE_DB_CHARSET;

    try {
        return new PDO($dsn, AGRIREVISE_DB_USER, AGRIREVISE_DB_PASS, array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ));
    } catch (PDOException $error) {
        agrirevise_error('Database connection failed.', 500);
    }
}

function agrirevise_clean_player_name($name)
{
    $name = preg_replace('/\s+/', ' ', trim((string) $name));
    $length = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);

    if ($length < 2) {
        agrirevise_error('Player name must be at least 2 characters.');
    }

    if ($length > 100) {
        agrirevise_error('Player name must be 100 characters or fewer.');
    }

    return $name;
}

function agrirevise_name_key($name)
{
    $name = agrirevise_clean_player_name($name);
    return function_exists('mb_strtolower')
        ? mb_strtolower($name, 'UTF-8')
        : strtolower($name);
}

function agrirevise_normalize_game_key($game)
{
    $game = strtolower(trim((string) $game));
    $aliases = array(
        'jenis_tanah' => 'jenis_sifat_tanah',
        'jenis_dan_sifat_tanah' => 'jenis_sifat_tanah',
        'tapak_penanaman' => 'tanah_tapak_penanaman',
        'tanah_di_tapak_penanaman' => 'tanah_tapak_penanaman',
        'memperbaiki_tanah' => 'kaedah_memperbaiki_tanah',
        'kos_baja' => 'pengiraan_kos_baja',
    );

    return isset($aliases[$game]) ? $aliases[$game] : $game;
}

function agrirevise_game_meta($game)
{
    global $AGRIREVISE_GAME_MAP;

    $game = agrirevise_normalize_game_key($game);
    return isset($AGRIREVISE_GAME_MAP[$game]) ? $AGRIREVISE_GAME_MAP[$game] : null;
}

function agrirevise_score_columns()
{
    global $AGRIREVISE_GAME_MAP;

    $columns = array();
    foreach ($AGRIREVISE_GAME_MAP as $meta) {
        $columns[] = '`' . $meta['column'] . '`';
    }

    return $columns;
}

function agrirevise_select_columns()
{
    global $AGRIREVISE_GAME_MAP;

    $columns = array('id', 'name', 'total_score', 'created_at', 'updated_at');
    foreach ($AGRIREVISE_GAME_MAP as $meta) {
        $columns[] = $meta['column'];
    }

    return implode(', ', $columns);
}

function agrirevise_player_payload($row)
{
    global $AGRIREVISE_GAME_MAP;

    $scores = array();
    foreach ($AGRIREVISE_GAME_MAP as $game => $meta) {
        $scores[$game] = (int) $row[$meta['column']];
    }

    return array(
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'total_score' => (int) $row['total_score'],
        'scores' => $scores,
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    );
}

function agrirevise_get_player_by_key($pdo, $nameKey)
{
    $sql = 'SELECT ' . agrirevise_select_columns() . ' FROM players WHERE name_key = :name_key LIMIT 1';
    $statement = $pdo->prepare($sql);
    $statement->execute(array(':name_key' => $nameKey));
    $row = $statement->fetch();

    return $row ? agrirevise_player_payload($row) : null;
}

function agrirevise_get_player_by_id($pdo, $id)
{
    $sql = 'SELECT ' . agrirevise_select_columns() . ' FROM players WHERE id = :id LIMIT 1';
    $statement = $pdo->prepare($sql);
    $statement->execute(array(':id' => (int) $id));
    $row = $statement->fetch();

    return $row ? agrirevise_player_payload($row) : null;
}

function agrirevise_find_or_create_player($pdo, $name)
{
    $name = agrirevise_clean_player_name($name);
    $nameKey = agrirevise_name_key($name);

    $statement = $pdo->prepare(
        'INSERT INTO players (name, name_key)
         VALUES (:name, :name_key)
         ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = CURRENT_TIMESTAMP'
    );

    $statement->execute(array(
        ':name' => $name,
        ':name_key' => $nameKey,
    ));

    return agrirevise_get_player_by_key($pdo, $nameKey);
}

function agrirevise_update_total_score($pdo, $playerId)
{
    $sql = 'UPDATE players SET total_score = ' . implode(' + ', agrirevise_score_columns()) . ' WHERE id = :id';
    $statement = $pdo->prepare($sql);
    $statement->execute(array(':id' => (int) $playerId));
}

function agrirevise_save_score($pdo, $name, $game, $score)
{
    $meta = agrirevise_game_meta($game);

    if (!$meta) {
        agrirevise_error('Unknown game key.');
    }

    $score = (int) $score;
    $score = max(0, min($score, (int) $meta['max']));
    $player = agrirevise_find_or_create_player($pdo, $name);
    $column = $meta['column'];

    try {
        $pdo->beginTransaction();

        $statement = $pdo->prepare(
            'UPDATE players
             SET `' . $column . '` = GREATEST(`' . $column . '`, :score),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :id'
        );

        $statement->execute(array(
            ':score' => $score,
            ':id' => (int) $player['id'],
        ));

        agrirevise_update_total_score($pdo, $player['id']);
        $pdo->commit();
    } catch (Exception $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        agrirevise_error('Score could not be saved.', 500);
    }

    return agrirevise_get_player_by_id($pdo, $player['id']);
}
