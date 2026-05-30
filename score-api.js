(function () {
  'use strict';

  const MAX_TOTAL_SCORE = 101;
  const PLAYER_NAME_KEY = 'playerName';
  const PLAYER_ID_KEY = 'playerId';

  const games = {
    jenis_sifat_tanah: {
      label: 'Jenis dan Sifat Tanah',
      maxScore: 15,
      scoreKey: 'jenisTanahScore',
      completedKey: 'jenisTanahCompleted'
    },
    tanah_tapak_penanaman: {
      label: 'Tanah di Tapak Penanaman',
      maxScore: 13,
      scoreKey: 'tapakPenanamanScore',
      completedKey: 'tapakPenanamanCompleted'
    },
    struktur_tanah: {
      label: 'Struktur Tanah',
      maxScore: 11,
      scoreKey: 'strukturTanahScore',
      completedKey: 'strukturTanahCompleted'
    },
    ph_tanah: {
      label: 'pH Tanah',
      maxScore: 18,
      scoreKey: 'phTanahScore',
      completedKey: 'phTanahCompleted'
    },
    kaedah_memperbaiki_tanah: {
      label: 'Kaedah Memperbaiki Tanah',
      maxScore: 15,
      scoreKey: 'kaedahMemperbaikiTanahScore',
      completedKey: 'kaedahMemperbaikiTanahCompleted'
    },
    jenis_baja: {
      label: 'Jenis Baja',
      maxScore: 14,
      scoreKey: 'jenisBajaScore',
      completedKey: 'jenisBajaCompleted'
    },
    pengiraan_kos_baja: {
      label: 'Pengiraan Kos Baja',
      maxScore: 15,
      scoreKey: 'pengiraanKosBajaScore',
      completedKey: 'pengiraanKosBajaCompleted'
    }
  };

  const aliases = {
    jenis_tanah: 'jenis_sifat_tanah',
    jenis_dan_sifat_tanah: 'jenis_sifat_tanah',
    tapak_penanaman: 'tanah_tapak_penanaman',
    tanah_di_tapak_penanaman: 'tanah_tapak_penanaman',
    memperbaiki_tanah: 'kaedah_memperbaiki_tanah',
    kos_baja: 'pengiraan_kos_baja'
  };

  function cleanName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  function resolveGameKey(gameKey) {
    const key = String(gameKey || '').trim().toLowerCase();
    return aliases[key] || key;
  }

  function getScriptUrl() {
    const script = document.currentScript || document.querySelector('script[src$="score-api.js"]');
    return script ? script.src : window.location.href;
  }

  function apiUrl(path) {
    return new URL(`api/${path}`, getScriptUrl()).toString();
  }

  async function request(path, options = {}) {
    const response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    let payload = {};

    try {
      payload = await response.json();
    } catch (error) {
      payload = {};
    }

    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || `Request failed with status ${response.status}`);
    }

    return payload;
  }

  function getPlayerName() {
    return cleanName(localStorage.getItem(PLAYER_NAME_KEY));
  }

  function setPlayer(player) {
    if (!player) return;

    localStorage.setItem(PLAYER_ID_KEY, String(player.id));
    localStorage.setItem(PLAYER_NAME_KEY, cleanName(player.name));
    applyRemoteScores(player);
  }

  function getLocalGameScore(gameKey) {
    const key = resolveGameKey(gameKey);
    const game = games[key];
    if (!game) return 0;

    const value = Number(localStorage.getItem(game.scoreKey));
    if (!Number.isFinite(value)) return 0;

    return Math.max(0, Math.min(game.maxScore, Math.trunc(value)));
  }

  function setLocalGameScore(gameKey, score) {
    const key = resolveGameKey(gameKey);
    const game = games[key];
    if (!game) return 0;

    const cleanScore = Math.max(0, Math.min(game.maxScore, Math.trunc(Number(score) || 0)));
    const bestScore = Math.max(getLocalGameScore(key), cleanScore);

    localStorage.setItem(game.scoreKey, String(bestScore));
    localStorage.setItem(game.completedKey, 'true');

    return bestScore;
  }

  function applyRemoteScores(player) {
    if (!player || !player.scores) return;

    Object.keys(games).forEach((gameKey) => {
      const score = Number(player.scores[gameKey]);
      if (!Number.isFinite(score) || score <= 0) return;
      setLocalGameScore(gameKey, score);
    });
  }

  async function savePlayer(name) {
    const playerName = cleanName(name);

    if (playerName.length < 2) {
      throw new Error('Player name must be at least 2 characters.');
    }

    localStorage.setItem(PLAYER_NAME_KEY, playerName);

    const payload = await request('player.php', {
      method: 'POST',
      body: JSON.stringify({ name: playerName })
    });

    setPlayer(payload.player);
    syncLocalScores(playerName).catch((error) => console.warn('Score sync failed:', error));

    return payload.player;
  }

  async function ensurePlayer(name) {
    const playerName = cleanName(name || getPlayerName());
    if (!playerName) return null;

    try {
      return await savePlayer(playerName);
    } catch (error) {
      console.warn('Player sync failed:', error);
      return null;
    }
  }

  async function saveScore(gameKey, score) {
    const key = resolveGameKey(gameKey);
    const game = games[key];
    const playerName = getPlayerName();

    if (!game || !playerName) return null;

    const localBest = setLocalGameScore(key, score);

    try {
      const payload = await request('score.php', {
        method: 'POST',
        body: JSON.stringify({
          name: playerName,
          game: key,
          score: localBest
        })
      });

      setPlayer(payload.player);
      return payload.player;
    } catch (error) {
      console.warn('Score save failed:', error);
      return null;
    }
  }

  async function syncLocalScores(name) {
    const playerName = cleanName(name || getPlayerName());
    if (!playerName) return [];

    const jobs = Object.keys(games).map((gameKey) => {
      const game = games[gameKey];
      const score = getLocalGameScore(gameKey);
      const completed = localStorage.getItem(game.completedKey) === 'true';

      if (!completed && score <= 0) return null;

      return request('score.php', {
        method: 'POST',
        body: JSON.stringify({
          name: playerName,
          game: gameKey,
          score
        })
      }).catch((error) => {
        console.warn(`Could not sync ${gameKey}:`, error);
        return null;
      });
    }).filter(Boolean);

    const results = await Promise.all(jobs);
    const latest = results.filter(Boolean).pop();

    if (latest && latest.player) {
      setPlayer(latest.player);
    }

    return results;
  }

  async function getLeaderboard(sortBy = 'total') {
    const sortKey = resolveGameKey(sortBy);
    const params = new URLSearchParams({ limit: '50' });

    if (sortKey && sortKey !== 'total' && games[sortKey]) {
      params.set('game', sortKey);
    }

    return request(`leaderboard.php?${params.toString()}`, {
      method: 'GET'
    });
  }

  function getLocalLeaderboardPlayer() {
    const name = getPlayerName();
    if (!name) return null;

    const scores = {};
    let total = 0;

    Object.keys(games).forEach((gameKey) => {
      const score = getLocalGameScore(gameKey);
      scores[gameKey] = score;
      total += score;
    });

    if (total <= 0) return null;

    return {
      id: 0,
      name,
      total_score: total,
      scores
    };
  }

  window.AgriReviseScores = {
    games,
    maxTotalScore: MAX_TOTAL_SCORE,
    cleanName,
    getPlayerName,
    savePlayer,
    ensurePlayer,
    saveScore,
    getLeaderboard,
    getLocalLeaderboardPlayer
  };
})();
