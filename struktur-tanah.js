// =============================================
//  STRUKTUR TANAH — Game Logic
//  Three phases: Visual ID → Matching → MCQ
// =============================================

let totalScore = 0;
let currentFasa = 1;

// ── Phase tracking ──
const TOTAL_FASA = 3;
const POINTS = {
  fasa1PerDrop : 10,   // per correct drop in fasa 1
  fasa2PerDrop : 15,   // per correct drop in fasa 2
  fasa3Correct : 20,   // per correct MCQ selection
  fasa3Bonus   : 30,   // bonus for perfect fasa 3
};

// ── DOM helpers ──
const $  = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

function addScore(pts) {
  totalScore += pts;

  const scoreDisplay = $('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = totalScore;
  }

  const pill = document.querySelector('.st-score-pill');
  if (pill) {
    pill.style.transform = 'scale(1.18)';
    setTimeout(() => {
      pill.style.transform = 'scale(1)';
    }, 220);
  }
}

// ── Progress bar ──
function setProgress(fasa) {
  const pct = ((fasa - 1) / TOTAL_FASA) * 100;
  $('progress-fill').style.width = pct + '%';
  $('step-label').textContent = `Fasa ${fasa} / ${TOTAL_FASA}`;
}

function showFasa(n) {
  document.querySelectorAll('.st-fasa').forEach(f => f.classList.add('hidden'));

  const el = $(`fasa-${n === 'complete' ? 'complete' : n}`);

  if (el) {
    el.classList.remove('hidden');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  currentFasa = n;

  if (n !== 'complete') {
    setProgress(n);
  }
}

// =============================================
//  DRAG & DROP — universal helper
// =============================================

let draggedEl = null;
let touchGhost = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function makeDraggable(chip, onDrop) {
  // ── Mouse drag ──
  chip.addEventListener('dragstart', (e) => {
    draggedEl = chip;
    chip.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  chip.addEventListener('dragend', () => {
    chip.classList.remove('dragging');
    draggedEl = null;
  });

  // ── Touch drag ──
  chip.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    draggedEl = chip;
    const rect = chip.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    // Create ghost
    touchGhost = chip.cloneNode(true);
    touchGhost.classList.add('st-touch-ghost');
    touchGhost.style.width = rect.width + 'px';
    touchGhost.style.left  = (touch.clientX - touchOffsetX) + 'px';
    touchGhost.style.top   = (touch.clientY - touchOffsetY) + 'px';
    document.body.appendChild(touchGhost);
    chip.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });

  chip.addEventListener('touchmove', (e) => {
    if (!touchGhost) return;
    const touch = e.touches[0];
    touchGhost.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchGhost.style.top  = (touch.clientY - touchOffsetY) + 'px';
    e.preventDefault();
  }, { passive: false });

  chip.addEventListener('touchend', (e) => {
    if (!draggedEl || !touchGhost) return;
    const touch = e.changedTouches[0];
    touchGhost.remove();
    touchGhost = null;
    chip.classList.remove('dragging');

    // Find drop target under finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el) {
      const dropZone = el.closest('.st-drop-zone, .st-match-drop');
      if (dropZone) onDrop(chip, dropZone);
    }
    draggedEl = null;
  });
}

function makeDroppable(zone, onDrop) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (draggedEl) onDrop(draggedEl, zone);
  });
}

// =============================================
//  FASA 1 — Visual Identification
// =============================================

let fasa1Checked = false;
const FASA1_TOTAL = 5;

function initFasa1() {
  document.querySelectorAll('#fasa-1 .st-drag-chip').forEach(chip => {
    makeDraggable(chip, handleFasa1Drop);
  });

  document.querySelectorAll('#fasa-1 .st-drop-zone').forEach(zone => {
    makeDroppable(zone, handleFasa1Drop);
  });

$('fasa1-next').addEventListener('click', () => {
  checkFasa1Answers();
});

}

function handleFasa1Drop(chip, zone) {
  if (fasa1Checked) return;

  // if target zone already has chip, move it back to bank
  const existingChip = zone.querySelector('.st-drag-chip');
  if (existingChip) {
    $('drag-bank-1').appendChild(existingChip);
  }

  zone.innerHTML = '';
  zone.appendChild(chip);
  chip.classList.remove('dragging');
}

function checkFasa1Answers() {
  let correct = 0;

  document.querySelectorAll('#fasa-1 .st-drop-zone').forEach(zone => {
    const chip = zone.querySelector('.st-drag-chip');

    zone.classList.remove('correct', 'wrong');

    if (!chip) {
      zone.classList.add('wrong');
      return;
    }

    if (chip.dataset.label === zone.dataset.answer) {
      zone.classList.add('correct');
      correct++;
    } else {
      zone.classList.add('wrong');
    }

    chip.draggable = false;
    chip.style.cursor = 'default';
  });

  totalScore += correct;

  $('fasa1-next').textContent = 'Seterusnya →';
  fasa1Checked = true;

showFasaResultModal(1, correct, FASA1_TOTAL, () => {
  showFasa(2);
  initFasa2();
});}

// =============================================
//  FASA 2 — Feature Matching
// =============================================

let fasa2Checked = false;
const FASA2_TOTAL = 3;

function initFasa2() {
  document.querySelectorAll('#fasa-2 .st-ciri-chip').forEach(chip => {
    makeDraggable(chip, handleFasa2Drop);
  });

  document.querySelectorAll('#fasa-2 .st-match-drop').forEach(zone => {
    makeDroppable(zone, handleFasa2Drop);
  });

  $('fasa2-next').disabled = false;
  $('fasa2-next').textContent = 'Semak Jawapan →';

  $('fasa2-next').addEventListener('click', () => {
    if (!fasa2Checked) {
      checkFasa2Answers();
    } else {
      showFasa(3);
      initFasa3();
    }
  });
}

function handleFasa2Drop(chip, zone) {
  if (fasa2Checked) return;

  const existingChip = zone.querySelector('.st-ciri-chip');
  if (existingChip) {
    $('ciri-bank').appendChild(existingChip);
  }

  zone.innerHTML = '';
  zone.appendChild(chip);
  chip.classList.remove('dragging');
}

function checkFasa2Answers() {
  let correct = 0;

  document.querySelectorAll('#fasa-2 .st-match-drop').forEach(zone => {
    const chip = zone.querySelector('.st-ciri-chip');

    zone.classList.remove('correct', 'wrong');

    if (!chip) {
      zone.classList.add('wrong');
      return;
    }

    if (chip.dataset.ciri === zone.dataset.answer) {
      zone.classList.add('correct');
      correct++;
    } else {
      zone.classList.add('wrong');
    }

    chip.draggable = false;
    chip.style.cursor = 'default';
  });

  totalScore += correct;

  $('fasa2-next').textContent = 'Seterusnya →';
  fasa2Checked = true;

showFasaResultModal(2, correct, FASA2_TOTAL, () => {
  showFasa(3);
  initFasa3();
});}

// =============================================
//  FASA 3 — MCQ Simulation
// =============================================

let fasa3Selected = new Set();
const FASA3_CORRECT = new Set(['pengudaraan', 'kepadatan', 'pegangan']);
const REQUIRED_SELECTIONS = 3;

function initFasa3() {
  fasa3Selected.clear();
  $('fasa3-hint').textContent = '';
  setPlant('neutral');

  $$('#fasa-3 .st-option-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected', 'correct-reveal', 'wrong-reveal');

    btn.addEventListener('click', () => {
      const val = btn.dataset.val;

      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        fasa3Selected.delete(val);
      } else {
        btn.classList.add('selected');
        fasa3Selected.add(val);
      }

      updatePlantPreview();
      $('fasa3-hint').textContent = '';
    });
  });

  $('fasa3-submit').addEventListener('click', handleFasa3Submit);
}

function updatePlantPreview() {
  const hasWrong = [...fasa3Selected].some(v => !FASA3_CORRECT.has(v));

  if (fasa3Selected.size === 0) {
    setPlant('neutral');
  } else if (hasWrong) {
    setPlant('sad');
  } else if (fasa3Selected.size === REQUIRED_SELECTIONS) {
    setPlant('happy');
  } else {
    setPlant('growing');
  }
}

function setPlant(state) {
  const emoji  = $('plant-emoji');
  const status = $('plant-status');

  const states = {
    neutral : { e: '🌱', s: 'Pilih jawapan yang betul…' },
    growing : { e: '🌿', s: 'Teruskan memilih…' },
    happy   : { e: '🌳', s: 'Pokok tumbuh sihat!' },
    sad     : { e: '🥀', s: 'Pilihan salah — pokok layu!' },
    great   : { e: '🌻', s: 'Sempurna! Semua jawapan betul!' },
  };

  const s = states[state] || states.neutral;
  emoji.textContent  = s.e;
  status.textContent = s.s;
}

function handleFasa3Submit() {
  if (fasa3Selected.size < REQUIRED_SELECTIONS) {
    $('fasa3-hint').textContent = `Pilih tepat ${REQUIRED_SELECTIONS} jawapan.`;
    return;
  }

  let correctCount = 0;
  let wrongCount   = 0;

  $$('#fasa-3 .st-option-btn').forEach(btn => {
    btn.disabled = true;
    const val       = btn.dataset.val;
    const isCorrect = btn.dataset.correct === 'true';
    const wasSelected = fasa3Selected.has(val);

    if (wasSelected && isCorrect)  { btn.classList.add('correct-reveal'); correctCount++; }
    if (wasSelected && !isCorrect) { btn.classList.add('wrong-reveal');   wrongCount++;   }
    if (!wasSelected && isCorrect) { btn.classList.add('correct-reveal'); } // reveal missed
  });

  totalScore += correctCount;

  if (wrongCount === 0 && correctCount === REQUIRED_SELECTIONS) {
    setPlant('great');
  } else if (wrongCount > 0) {
    setPlant('sad');
    $('fasa3-hint').textContent = `${correctCount} betul, ${wrongCount} salah. Cuba lagi!`;
  } else {
    setPlant('happy');
  }

  $('fasa3-submit').textContent = 'Selesai ✓';
  $('fasa3-submit').disabled = false;
  $('fasa3-submit').removeEventListener('click', handleFasa3Submit);
  $('fasa3-submit').addEventListener('click', finishGame);
}

// =============================================
//  COMPLETE
// =============================================

function finishGame() {
  setProgress(TOTAL_FASA + 1);
  $('progress-fill').style.width = '100%';
  $('step-label').textContent = 'Selesai!';
  const totalQuestions = FASA1_TOTAL + FASA2_TOTAL + REQUIRED_SELECTIONS;
  const percentage = Math.round((totalScore / totalQuestions) * 100);

  $('final-score-display').textContent = `${totalScore}/${totalQuestions} (${percentage}%)`;
  localStorage.setItem('strukturTanahScore', percentage);

  // Mark completed in localStorage so pemuliharaan page can unlock next card if needed
  localStorage.setItem('strukturTanahCompleted', 'true');
  localStorage.setItem('strukturTanahScore', totalScore);

  showFasa('complete');
}

function restartGame() {
  totalScore  = 0;
  $('score-display').textContent = '0';
  currentFasa = 1;

  // Reset fasa 1 chips
  const bank1 = $('drag-bank-1');
  document.querySelectorAll('#fasa-1 .st-drop-zone').forEach(zone => {
    const chip = zone.querySelector('.st-drag-chip');
    if (chip) {
      chip.draggable = true;
      chip.style.cursor = 'grab';
      bank1.appendChild(chip);
    }
    zone.classList.remove('correct', 'wrong');
    if (!zone.querySelector('.st-drop-hint')) {
      const hint = document.createElement('span');
      hint.className = 'st-drop-hint';
      hint.textContent = 'Lepaskan di sini';
      zone.appendChild(hint);
    }
  });
  $('fasa1-next').disabled = true;
  fasa1Correct = 0;

  // Reset fasa 2 chips
  const bank2 = $('ciri-bank');
  document.querySelectorAll('#fasa-2 .st-match-drop').forEach(zone => {
    const chip = zone.querySelector('.st-ciri-chip');
    if (chip) {
      chip.draggable = true;
      chip.style.cursor = 'grab';
      bank2.appendChild(chip);
    }
    zone.classList.remove('correct', 'wrong');
    if (!zone.querySelector('.st-drop-hint')) {
      const hint = document.createElement('span');
      hint.className = 'st-drop-hint';
      hint.textContent = 'Lepaskan di sini';
      zone.appendChild(hint);
    }
  });
  $('fasa2-next').disabled = true;
  fasa2Correct = 0;

  // Reset fasa 3
  fasa3Selected.clear();
  $$('#fasa-3 .st-option-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected', 'correct-reveal', 'wrong-reveal');
  });
  $('fasa3-submit').textContent = 'Semak Jawapan';
  $('fasa3-hint').textContent = '';
  setPlant('neutral');

  setProgress(1);
  showFasa(1);
}

// =============================================
//  BOOT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  setProgress(1);
  initFasa1();
});

function showFasaResultModal(fasa, correct, total, nextAction) {
  const modal = $('fasa-result-modal');
  const title = $('fasa-result-title');
  const message = $('fasa-result-message');
  const nextBtn = $('fasa-result-next');

  title.textContent = `Fasa ${fasa} Selesai 🎉`;
  message.textContent = `Anda mendapat ${correct}/${total} betul (${Math.round((correct / total) * 100)}%)`;

  modal.classList.remove('hidden');

  nextBtn.onclick = () => {
    modal.classList.add('hidden');
    nextAction();
  };
}
