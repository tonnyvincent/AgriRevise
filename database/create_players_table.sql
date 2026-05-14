CREATE TABLE IF NOT EXISTS players (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  name_key VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

  score_jenis_sifat_tanah TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_tanah_tapak_penanaman TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_struktur_tanah TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_ph_tanah TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_kaedah_memperbaiki_tanah TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_jenis_baja TINYINT UNSIGNED NOT NULL DEFAULT 0,
  score_pengiraan_kos_baja TINYINT UNSIGNED NOT NULL DEFAULT 0,

  total_score SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_players_name_key (name_key),
  KEY idx_players_total_score (total_score),
  KEY idx_players_score_jenis_sifat_tanah (score_jenis_sifat_tanah),
  KEY idx_players_score_tanah_tapak_penanaman (score_tanah_tapak_penanaman),
  KEY idx_players_score_struktur_tanah (score_struktur_tanah),
  KEY idx_players_score_ph_tanah (score_ph_tanah),
  KEY idx_players_score_kaedah_memperbaiki_tanah (score_kaedah_memperbaiki_tanah),
  KEY idx_players_score_jenis_baja (score_jenis_baja),
  KEY idx_players_score_pengiraan_kos_baja (score_pengiraan_kos_baja)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
