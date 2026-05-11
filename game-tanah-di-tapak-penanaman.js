// Game state for Tanah di Tapak Penanaman
let expeditionState = {
  currentStation: 1,
  stationsCompleted: new Set(),

  scores: {
    station1: null,
    station2: null,
    station3: null
  },

  sessionLog: [], // full attempt log

  answers: {
    station1: {},
    station2: {},
    station3: {}
  }
};

const TOTAL_EXPEDITION_QUESTIONS = 10;

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  initializeDragAndDrop();
  initializeStationCheckButtons();
  updateProgress();
  updateScoreDisplay();
  updateMissionStatus();
  document.querySelectorAll('.btn-restart-expedition').forEach(button => {
    button.addEventListener('click', resetExpedition);
  });
});

// Initialize drag and drop for all stations
function initializeDragAndDrop() {
  document.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragleave', handleDragLeave);
  });

  document.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd, { passive: false });
    item.addEventListener('touchcancel', cleanupTouchDrag, { passive: false });
  });
}

function handleTouchStart(e) {
  e.preventDefault();

  touchDraggedElement = this;
  draggedElement = this;

  this.classList.add('dragging');

  const rect = this.getBoundingClientRect();
  dragPreview = this.cloneNode(true);
  dragPreview.classList.add('drag-preview');
  dragPreview.style.width = `${Math.max(rect.width, 62)}px`;
  dragPreview.style.height = `${Math.max(rect.height, 30)}px`;

  document.body.appendChild(dragPreview);
  document.body.classList.add('tdtp-touch-dragging');

  movePreview(e.touches[0]);
}

function movePreview(touch) {
  if (!dragPreview) return;

  dragPreview.style.left = `${touch.clientX}px`;
  dragPreview.style.top = `${touch.clientY}px`;
  dragPreview.style.transform = 'translate(-50%, calc(-100% - 12px)) scale(1.06)';
}

function handleTouchMove(e) {
  e.preventDefault();

  const touch = e.touches[0];

  // move preview
  movePreview(touch);

  const elementBelow = document.elementFromPoint(
    touch.clientX,
    touch.clientY
  );

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });

  const dropZone = elementBelow?.closest('.drop-zone');

  if (dropZone) {
    dropZone.classList.add('drag-over');
  }
}

function handleTouchEnd(e) {
  e.preventDefault();

  const touch = e.changedTouches[0];

  const elementBelow = document.elementFromPoint(
    touch.clientX,
    touch.clientY
  );

  const dropZone = elementBelow?.closest('.drop-zone');

  if (dropZone && touchDraggedElement) {
    draggedElement = touchDraggedElement;

    handleDrop.call(dropZone, {
      preventDefault: () => {}
    });
  }

  cleanupTouchDrag(e);
}

function cleanupTouchDrag(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  if (touchDraggedElement) {
    touchDraggedElement.classList.remove('dragging');
  }

  if (dragPreview) {
    dragPreview.remove();
    dragPreview = null;
  }

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });

  document.body.classList.remove('tdtp-touch-dragging');
  touchDraggedElement = null;
  draggedElement = null;
}

// Current dragging element
let draggedElement = null;
let touchDraggedElement = null;
let dragPreview = null;

function getStationBank(station) {
  return document.querySelector(`#station-${station} .drag-options`);
}

function restoreDragItem(item, station) {
  if (!item) return;

  item.classList.remove('dropped-item', 'correct', 'incorrect', 'dragging');
  item.draggable = true;

  const bank = getStationBank(station);
  if (bank) {
    bank.appendChild(item);
  }
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  // Only remove if dragging over a different element
  if (e.target === this) {
    this.classList.remove('drag-over');
  }
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');

  if (!draggedElement) return;

  const dropZone = this;
  const currentStation = expeditionState.currentStation;
  const draggedValue = getDraggedValue(draggedElement, currentStation);
  const expectedAnswer = dropZone.getAttribute('data-answer');

  if (!draggedValue) {
    return;
  }

  const existingItem = dropZone.querySelector('.dropped-item');
  if (existingItem) {
    restoreDragItem(existingItem, currentStation);
  }

  clearPreviousPlacement(currentStation, draggedValue, expectedAnswer);

  draggedElement.draggable = true;
  draggedElement.classList.add('dropped-item');
  draggedElement.classList.remove('dragging', 'correct', 'incorrect');

  const slot = dropZone.querySelector('.zone-slot');

  if (slot) {
    slot.innerHTML = ""; // clear previous
    slot.appendChild(draggedElement);
  }
  
  expeditionState.answers[`station${currentStation}`][expectedAnswer] = draggedValue;

  updateStationCheckButton(currentStation);
}

function getDraggedValue(element, station) {
  if (station === 1) {
    return element.getAttribute('data-color');
  } else if (station === 2) {
    return element.getAttribute('data-soil');
  } else if (station === 3) {
    return element.getAttribute('data-step');
  }
  return null;
}

function clearPreviousPlacement(station, draggedValue, currentZone) {
  const answers = expeditionState.answers[`station${station}`];

  Object.keys(answers).forEach(answerKey => {
    if (answerKey !== currentZone && answers[answerKey] === draggedValue) {

      const oldZone = document.querySelector(
        `#station-${station} .drop-zone[data-answer="${answerKey}"]`
      );

      if (oldZone) {
        // clear slot (NEW STRUCTURE)
        const slot = oldZone.querySelector('.zone-slot');
        const oldItem = slot?.querySelector('.dropped-item');
        if (oldItem) {
          restoreDragItem(oldItem, station);
        }
        if (slot) slot.innerHTML = "";

        // remove styling states
        oldZone.classList.remove('correct', 'incorrect');
      }

      // clean state
      delete answers[answerKey];
    }
  });
}

function initializeStationCheckButtons() {
  document.querySelectorAll('.tdtp-check-btn').forEach(button => {
    button.addEventListener('click', () => {
      const station = Number(button.getAttribute('data-station'));

      if (!isStationFilled(station) || expeditionState.stationsCompleted.has(station)) {
        return;
      }

      button.disabled = true;
      validateStation(station);
    });
  });
}

function isStationFilled(station) {
  const dropZones = document.querySelectorAll(`#station-${station} .drop-zone`);

  return [...dropZones].every(zone => zone.querySelector('.dropped-item'));
}

function updateStationCheckButton(station) {
  const button = document.querySelector(`.tdtp-check-btn[data-station="${station}"]`);
  if (!button) return;

  button.disabled = !isStationFilled(station) || expeditionState.stationsCompleted.has(station);
}

function updateAllStationCheckButtons() {
  for (let station = 1; station <= 3; station++) {
    updateStationCheckButton(station);
  }
}

function validateStation(station) {
  if (expeditionState.stationsCompleted.has(station)) {
    return;
  }

  const dropZones = document.querySelectorAll(`#station-${station} .drop-zone`);

  let correctCount = 0;
  let total = dropZones.length;

  let detailLog = [];

  dropZones.forEach(zone => {
    zone.classList.remove('correct', 'incorrect');

    const expectedAnswer = zone.getAttribute('data-answer');
    const droppedItem = zone.querySelector('.dropped-item');

    let droppedValue = null;

    if (station === 1) {
      droppedValue = droppedItem?.getAttribute('data-color');
    } else if (station === 2) {
      droppedValue = droppedItem?.getAttribute('data-soil');
    } else if (station === 3) {
      droppedValue = droppedItem?.getAttribute('data-step');
    }

    const isCorrect = droppedValue === expectedAnswer;

    if (isCorrect) {
      zone.classList.add('correct');
      droppedItem?.classList.add('correct');
      correctCount++;
    } else {
      zone.classList.add('incorrect');
      droppedItem?.classList.add('incorrect');
    }

    // 🔥 record per question
    detailLog.push({
      question: expectedAnswer,
      selected: droppedValue,
      correct: isCorrect
    });
  });

  const scoreData = {
    station,
    correct: correctCount,
    total,
    percentage: Math.round((correctCount / total) * 100),
    details: detailLog,
    timestamp: new Date().toISOString()
  };

  expeditionState.scores[`station${station}`] = scoreData;
  expeditionState.stationsCompleted.add(station);
  updateScoreDisplay();
  updateStationCheckButton(station);

  // 🔥 store full session log
  expeditionState.sessionLog.push(scoreData);

  // 🔥 CLEAN CONSOLE OUTPUT (VERY IMPORTANT FOR DEBUGGING)
  console.log("========== STATION RESULT ==========");
  console.log("Station:", station);
  console.log("Score:", `${correctCount}/${total}`);
  console.log("Percentage:", `${scoreData.percentage}%`);
  console.table(detailLog);
  console.log("Full Score Object:", scoreData);
  console.log("====================================");

  // always continue
  setTimeout(() => {
    showStationModal(station);
  }, 400);
}

// printing the final result in a clean format for easy debugging and review

function printFinalResult() {
  const totalCorrect =
    expeditionState.scores.station1.correct +
    expeditionState.scores.station2.correct +
    expeditionState.scores.station3.correct;

  const totalQuestions =
    expeditionState.scores.station1.total +
    expeditionState.scores.station2.total +
    expeditionState.scores.station3.total;

  const finalPercent = Math.round((totalCorrect / totalQuestions) * 100);

  console.log("######## FINAL RESULT ########");
  console.log("Total Correct:", totalCorrect);
  console.log("Total Questions:", totalQuestions);
  console.log("Final Score:", finalPercent + "%");
  console.log("SESSION LOG:", expeditionState.sessionLog);
  console.log("FULL STATE:", expeditionState);
  console.log("##############################");
}

function showStationModal(station) {
  const modal = document.getElementById('station-complete-modal');
  modal.classList.remove('hidden');

  const score = expeditionState.scores[`station${station}`];
  const message = modal.querySelector('p');

  message.textContent =
    `Anda mendapat ${score.correct}/${score.total} betul (${score.percentage}%)`;

  const nextBtn = document.getElementById('next-station-btn');

  // 🔥 IMPORTANT: remove old handlers
  nextBtn.onclick = null;

  if (station === 3) {
    nextBtn.textContent = "Selesai";

    nextBtn.onclick = () => {
      modal.classList.add('hidden');
      showFinalCompletion(); // FINAL SCREEN
    };

  } else {
    nextBtn.textContent = "Lanjut ke Stesen " + (station + 1);

    nextBtn.onclick = () => {
      modal.classList.add('hidden');
      goToStation(station + 1);
    };
  }

  const restartBtn = document.getElementById('restart-expedition-btn');
  if (restartBtn) {
    restartBtn.onclick = () => {
      modal.classList.add('hidden');
      resetExpedition();
    };
  }
}

// Next station buttons
document.getElementById('btn-station-1-next')?.addEventListener('click', function() {
  goToStation(2);
});

document.getElementById('btn-station-2-next')?.addEventListener('click', function() {
  goToStation(3);
});

document.getElementById('btn-station-3-next')?.addEventListener('click', function() {
  printFinalResult(); // call to print final result in console
  showCompletion();
});

function goToStation(station) {
  document.getElementById(`station-${expeditionState.currentStation}`).style.display = 'none';
  document.getElementById(`station-${station}`).style.display = 'block';
  expeditionState.currentStation = station;
  updateProgress();
  updateStationCheckButton(station);
  updateMissionStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  document.getElementById('station-num').textContent = expeditionState.currentStation;
  const progress = (expeditionState.currentStation / 3) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
}

function getTotalCorrectAnswers() {
  return Object.values(expeditionState.scores)
    .filter(Boolean)
    .reduce((sum, score) => sum + score.correct, 0);
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('tdtp-score-display');
  if (scoreDisplay) {
    const score = getTotalCorrectAnswers();
    scoreDisplay.textContent = score;
    scoreDisplay.parentElement?.setAttribute('aria-label', `Skor ${score}/${TOTAL_EXPEDITION_QUESTIONS}`);
  }
}

function updateMissionStatus() {
  const statusLabel = document.getElementById('mission-status-label');
  if (statusLabel) {
    statusLabel.textContent = `${expeditionState.currentStation} / 3`;
  }
}

function resetExpedition() {
  expeditionState.currentStation = 1;
  expeditionState.stationsCompleted.clear();
  expeditionState.answers = {
    station1: {},
    station2: {},
    station3: {}
  };
  expeditionState.scores = {
    station1: null,
    station2: null,
    station3: null
  };

  for (let station = 1; station <= 3; station++) {
    const stationEl = document.getElementById(`station-${station}`);
    if (stationEl) {
      stationEl.style.display = station === 1 ? 'block' : 'none';
    }

    const nextBtn = document.getElementById(`btn-station-${station}-next`);
    if (nextBtn) {
      nextBtn.style.display = 'none';
    }

    document.querySelectorAll(`#station-${station} .drop-zone`).forEach(zone => {
      zone.classList.remove('correct', 'incorrect');
      const dropItem = zone.querySelector('.dropped-item');
      if (dropItem) {
        restoreDragItem(dropItem, station);
      }
    });
  }

  document.querySelector('.expedition-game').style.display = 'block';
  document.getElementById('completion-screen').classList.add('hidden');
  updateProgress();
  updateAllStationCheckButtons();
  updateScoreDisplay();
  updateMissionStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
  document.getElementById('completion-screen').classList.remove('hidden');
}

function showFinalCompletion() {
  const s1 = expeditionState.scores.station1;
  const s2 = expeditionState.scores.station2;
  const s3 = expeditionState.scores.station3;

  const totalCorrect = s1.correct + s2.correct + s3.correct;
  const totalQuestions = s1.total + s2.total + s3.total;

  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  updateScoreDisplay();

  localStorage.setItem('tapakPenanamanCompleted', 'true');
  localStorage.setItem('tapakPenanamanScore', String(percentage));

  // ======================================
  // SAVE TO LOCAL LEADERBOARD
  // ======================================

  const playerName = localStorage.getItem('playerName') || 'Pemain';

  const leaderboardScores = JSON.parse(
    localStorage.getItem('leaderboardScores')
  ) || [];

  leaderboardScores.push({
    name: playerName,
    score: percentage,
    date: new Date().toISOString()
  });

  localStorage.setItem(
    'leaderboardScores',
    JSON.stringify(leaderboardScores)
  );


  document.getElementById('tdtp-final-score').textContent = `${totalCorrect}/${totalQuestions}`;
  document.getElementById('completion-screen').classList.remove('hidden');

  // log for later DB usage
  console.log("FINAL SCORE:", {
    totalCorrect,
    totalQuestions,
    percentage,
    session: expeditionState.sessionLog
  });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
.drag-item { 
  cursor: move; 
  padding: 6px 10px; 
  margin: 12px 1px 1px 1px; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  color: white; 
  border-radius: 8px; 
  font-weight: 600; 
  transition: all 0.2s ease; 
  user-select: none; 
  display: inline-block; 
  font-size: 11px; 
}

  .drag-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.35);
  }

  .drag-item.dragging {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .drag-options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }

  .drop-zones {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 8px;
    margin: 10px 0;
  }

.drop-zone {
  display: flex;
  align-items: center;
  gap: 12px;

  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 12px;

  background: #fafafa;

  min-height: 80px;
  box-sizing: border-box;
}

  .zone-content {
    flex: 1;
    width: 70%;
    min-width: 0;

    font-size: 11px;
    color: #333;

    display: flex;
    align-items: center;

    overflow: hidden;
    text-overflow: ellipsis;

  }

  .zone-slot {
    flex: 0 0 80px;
    width: 100px;
    height: 40px;

    border: 2px dashed #bbb;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: white;
    overflow: hidden; /* prevents weird overflow */
  }

  .drop-zone.drag-over {
    border-color: #667eea;
    background: #f0f4ff;
  }

  .drop-zone .dropped-item {
    align-self: flex-start;
    margin-top: 0;
  }

  .zone-label {
    font-weight: 700;
    color: var(--green-mid);
    font-size: 11px;
    text-transform: uppercase;
  }

  .zone-content {
    font-size: 11px;
    color: #555;
    min-height: 40px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .zone-note {
    font-size: 11px;
    color: #999;
    display: block;
  }

  .dropped-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 1px;
  }

  .dropped-item.correct {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    animation: correctPop 0.6s ease;
  }

  .dropped-item.incorrect {
    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    animation: incorrectShake 0.6s ease;
  }

  .drop-zone.correct {
    border-color: #38ef7d;
    background: #f0fff4;
  }

  .drop-zone.incorrect {
    border-color: #f45c43;
    background: #fff0f0;
  }

  .ordered-sequence .drop-zone {
    min-height: 70px;
  }

  .instruction-text {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: #666;
    margin-top: 8px;
  }

  .expedition-game .question-card {
    max-width: 100%;
  }

  .game-station {
    animation: fadeIn 0.5s ease;
  }

  @keyframes correctPop {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes incorrectShake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
