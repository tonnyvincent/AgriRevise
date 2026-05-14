// ======================================
// DATABASE LEADERBOARD
// ======================================

const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardCard = document.querySelector('.leaderboard-card');
const clearBtn = document.getElementById('clear-score-btn');
const sortSelect = document.getElementById('leaderboard-sort');
const scoreHeading = document.getElementById('leaderboard-score-heading');
const pagination = document.getElementById('leaderboard-pagination');
const prevBtn = document.getElementById('leaderboard-prev');
const nextBtn = document.getElementById('leaderboard-next');
const pageLabel = document.getElementById('leaderboard-page-label');
const scoreApi = window.AgriReviseScores;

let players = [];
let currentSort = sortSelect ? sortSelect.value : 'total';
let currentPage = 1;
const pageSize = 7;

function getGameMeta(gameKey) {
  return scoreApi?.games?.[gameKey] || null;
}

function getScore(player, sortKey = currentSort) {
  if (sortKey === 'total') {
    return Number(player.total_score || player.score || 0);
  }

  return Number(player.scores?.[sortKey] || 0);
}

function getMaxScore(sortKey = currentSort) {
  if (sortKey === 'total') {
    return scoreApi?.maxTotalScore || 82;
  }

  return getGameMeta(sortKey)?.maxScore || 0;
}

function setStatus(message) {
  leaderboardList.innerHTML = '';
  leaderboardCard?.classList.remove('leaderboard-full-page');

  if (pagination) {
    pagination.classList.add('hidden');
  }

  const empty = document.createElement('div');
  empty.className = 'empty-score';
  empty.textContent = message;

  leaderboardList.appendChild(empty);
}

function getLocalFallbackPlayers() {
  const localPlayer = scoreApi?.getLocalLeaderboardPlayer?.();
  return localPlayer ? [localPlayer] : [];
}

function updateHeading() {
  if (!scoreHeading) return;

  scoreHeading.textContent = currentSort === 'total' ? 'Skor Jumlah' : 'Skor Game';
}

function getSortedPlayers() {
  return players
    .slice()
    .sort((a, b) => getScore(b) - getScore(a) || Number(b.total_score || 0) - Number(a.total_score || 0));
}

function getTotalPages() {
  return Math.max(1, Math.ceil(players.length / pageSize));
}

function updatePagination() {
  const totalPages = getTotalPages();

  currentPage = Math.min(Math.max(currentPage, 1), totalPages);

  if (pageLabel) {
    pageLabel.textContent = `${currentPage} / ${totalPages}`;
  }

  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }

  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
  }

  if (pagination) {
    pagination.classList.toggle('hidden', players.length === 0);
  }
}

function renderLeaderboard() {
  updateHeading();
  leaderboardList.innerHTML = '';
  updatePagination();

  if (!players.length) {
    setStatus('Tiada skor lagi.');
    return;
  }

  const visiblePlayers = getSortedPlayers()
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  leaderboardCard?.classList.toggle('leaderboard-full-page', visiblePlayers.length === pageSize);

  visiblePlayers.forEach((player, index) => {
      const rank = ((currentPage - 1) * pageSize) + index + 1;
      const row = document.createElement('div');
      row.className = 'leaderboard-row';

      const rankCell = document.createElement('div');
      const rankBadge = document.createElement('div');
      rankBadge.className = 'rank-badge';
      rankBadge.textContent = rank;
      rankCell.appendChild(rankBadge);

      const name = document.createElement('div');
      name.className = 'player-name';
      name.textContent = player.name;

      const score = document.createElement('div');
      score.className = 'player-score';

      const mainScore = document.createElement('div');
      mainScore.className = 'player-score-main';
      mainScore.textContent = `${getScore(player)}/${getMaxScore()}`;
      score.appendChild(mainScore);

      if (currentSort !== 'total') {
        const totalScore = document.createElement('div');
        totalScore.className = 'player-score-sub';
        totalScore.textContent = `Jumlah ${Number(player.total_score || 0)}/${scoreApi?.maxTotalScore || 82}`;
        score.appendChild(totalScore);
      }

      row.append(rankCell, name, score);
      leaderboardList.appendChild(row);
    });
}

async function loadLeaderboard() {
  currentSort = sortSelect ? sortSelect.value : 'total';
  currentPage = 1;
  setStatus('Memuatkan skor...');

  if (!scoreApi) {
    players = getLocalFallbackPlayers();
    renderLeaderboard();
    return;
  }

  try {
    const response = await scoreApi.getLeaderboard(currentSort);
    players = response.players || [];
  } catch (error) {
    console.warn('Leaderboard DB load failed:', error);
    players = getLocalFallbackPlayers();

    if (!players.length) {
      setStatus('Database belum disambungkan.');
      return;
    }
  }

  renderLeaderboard();
}

if (sortSelect) {
  sortSelect.addEventListener('change', loadLeaderboard);
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentPage -= 1;
    renderLeaderboard();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentPage += 1;
    renderLeaderboard();
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    const confirmDelete = confirm('Padam skor pada peranti ini?');

    if (!confirmDelete) return;

    localStorage.removeItem('leaderboardScores');
    players = getLocalFallbackPlayers();
    renderLeaderboard();
  });
}

loadLeaderboard();
