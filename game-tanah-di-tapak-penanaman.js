// Game state for Tanah di Tapak Penanaman
let expeditionState = {
  currentStation: 1,
  stationsCompleted: new Set(),
  answers: {
    station1: {},
    station2: {},
    station3: {}
  }
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  initializeDragAndDrop();
  updateProgress();
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
}

// Current dragging element
let draggedElement = null;

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
    existingItem.remove();
  }

  clearPreviousPlacement(currentStation, draggedValue, expectedAnswer);

  const itemClone = draggedElement.cloneNode(true);
  itemClone.draggable = false;
  itemClone.classList.add('dropped-item');
  itemClone.classList.remove('dragging');

  dropZone.appendChild(itemClone);
  expeditionState.answers[`station${currentStation}`][expectedAnswer] = draggedValue;

  checkStationCompletion(currentStation);
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
      const oldZone = document.querySelector(`#station-${station} .drop-zone[data-answer="${answerKey}"]`);
      if (oldZone) {
        const oldItem = oldZone.querySelector('.dropped-item');
        if (oldItem) {
          oldItem.remove();
        }
        oldZone.classList.remove('correct', 'incorrect');
      }
      delete answers[answerKey];
    }
  });
}

function checkStationCompletion(station) {
  const dropZones = document.querySelectorAll(`#station-${station} .drop-zone`);
  let isComplete = true;

  dropZones.forEach(zone => {
    if (!zone.querySelector('.dropped-item')) {
      isComplete = false;
    }
  });

  if (isComplete) {
    // Validate answers
    validateStation(station);
  }
}

function validateStation(station) {
  const dropZones = document.querySelectorAll(`#station-${station} .drop-zone`);
  let allCorrect = true;

  dropZones.forEach(zone => {
    zone.classList.remove('correct', 'incorrect');
    const expectedAnswer = zone.getAttribute('data-answer');
    const droppedItem = zone.querySelector('.dropped-item');
    
    if (droppedItem) {
      let droppedValue = null;
      
      if (station === 1) {
        droppedValue = droppedItem.getAttribute('data-color');
      } else if (station === 2) {
        droppedValue = droppedItem.getAttribute('data-soil');
      } else if (station === 3) {
        droppedValue = droppedItem.getAttribute('data-step');
      }

      if (droppedValue === expectedAnswer) {
        zone.classList.add('correct');
        droppedItem.classList.add('correct');
      } else {
        zone.classList.add('incorrect');
        droppedItem.classList.add('incorrect');
        allCorrect = false;
      }
    } else {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    const nextBtn = document.getElementById(`btn-station-${station}-next`);
    if (nextBtn) {
      setTimeout(() => {
        nextBtn.style.display = 'block';
      }, 500);
    }

    expeditionState.stationsCompleted.add(station);
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
  showCompletion();
});

function goToStation(station) {
  document.getElementById(`station-${expeditionState.currentStation}`).style.display = 'none';
  document.getElementById(`station-${station}`).style.display = 'block';
  expeditionState.currentStation = station;
  updateProgress();
  updateMissionStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  document.getElementById('station-num').textContent = expeditionState.currentStation;
  const progress = (expeditionState.currentStation / 3) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
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
        dropItem.remove();
      }
    });
  }

  document.querySelector('.expedition-game').style.display = 'block';
  document.getElementById('completion-screen').style.display = 'none';
  updateProgress();
  updateMissionStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
  document.querySelector('.expedition-game').style.display = 'none';
  document.getElementById('completion-screen').style.display = 'flex';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  .drag-item {
    cursor: move;
    padding: 8px 12px;
    margin: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
    user-select: none;
    display: inline-block;
    font-size: 0.92rem;
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
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
    min-height: 60px;
    transition: all 0.2s ease;
    cursor: drop;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
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
    margin-bottom: 8px;
    font-size: 14px;
    text-transform: uppercase;
  }

  .zone-content {
    font-size: 13px;
    color: #555;
    min-height: 40px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .zone-note {
    font-size: 12px;
    color: #999;
    display: block;
    margin-top: 4px;
  }

  .dropped-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
    margin: 2px;
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
    font-size: 14px;
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
