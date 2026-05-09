// ======================================
// LOCAL LEADERBOARD
// ======================================

const leaderboardList = document.getElementById('leaderboard-list');
const clearBtn = document.getElementById('clear-score-btn');

// GET SCORES
let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];

// SORT HIGHEST SCORE
scores.sort((a, b) => b.score - a.score);

function renderLeaderboard() {

  leaderboardList.innerHTML = '';

  if (scores.length === 0) {

    leaderboardList.innerHTML = `
      <div class="empty-score">
        Tiada skor lagi.
      </div>
    `;

    return;
  }

  scores.forEach((player, index) => {

    const row = document.createElement('div');

    row.className = 'leaderboard-row';

    row.innerHTML = `
      <div>
        <div class="rank-badge">
          ${index + 1}
        </div>
      </div>

      <div class="player-name">
        ${player.name}
      </div>

      <div class="player-score">
        ${player.score}%
      </div>
    `;

    leaderboardList.appendChild(row);
  });
}

renderLeaderboard();

// CLEAR BUTTON
clearBtn.addEventListener('click', () => {

  const confirmDelete = confirm('Padam semua skor?');

  if (!confirmDelete) return;

  localStorage.removeItem('leaderboardScores');

  scores = [];

  renderLeaderboard();
});
