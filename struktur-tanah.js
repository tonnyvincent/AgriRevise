// =============================================
//  STRUKTUR TANAH — Game Logic
//  Three phases: Visual ID → Matching → MCQ
// =============================================

let totalScore = 0;
let currentFasa = 1;
let lives = null;

// ── Phase tracking ──
const TOTAL_FASA = 4;
const TOTAL_QUESTIONS = 14;
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
  updateScoreDisplay();

  const pill = document.querySelector('.st-score-pill');
  if (pill) {
    pill.style.transform = 'scale(1.18)';
    setTimeout(() => {
      pill.style.transform = 'scale(1)';
    }, 220);
  }
}

function updateScoreDisplay() {
  const scoreDisplay = $('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = totalScore;
    scoreDisplay.parentElement?.setAttribute('aria-label', `Skor ${totalScore}/${TOTAL_QUESTIONS}`);
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
  setFasaNotice(1, '');

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
  const zones = Array.from(document.querySelectorAll('#fasa-1 .st-drop-zone'));

  if (zones.some(zone => !zone.querySelector('.st-drag-chip'))) {
    setFasaNotice(1, 'Lengkapkan semua dulang dahulu sebelum menyemak jawapan.');
    return;
  }

  zones.forEach(zone => {
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
  updateScoreDisplay();

  const wrongCount = FASA1_TOTAL - correct;
  if (wrongCount > 0) {
    window.AgriReviseGame?.playSound('wrong');
    const livesLeft = lives ? lives.lose(wrongCount) : 1;
    if (livesLeft <= 0) return;
  } else {
    window.AgriReviseGame?.playSound('correct');
  }

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
const FASA2_TOTAL = 4;

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
  setFasaNotice(2, '');

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
  const zones = Array.from(document.querySelectorAll('#fasa-2 .st-match-drop'));

  if (zones.some(zone => !zone.querySelector('.st-ciri-chip'))) {
    setFasaNotice(2, 'Lengkapkan semua padanan dahulu sebelum menyemak jawapan.');
    return;
  }

  zones.forEach(zone => {
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
  updateScoreDisplay();

  const wrongCount = FASA2_TOTAL - correct;
  if (wrongCount > 0) {
    window.AgriReviseGame?.playSound('wrong');
    const livesLeft = lives ? lives.lose(wrongCount) : 1;
    if (livesLeft <= 0) return;
  } else {
    window.AgriReviseGame?.playSound('correct');
  }

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
let fasa4Selected = new Set();
const FASA3_CORRECT = new Set(['lapisan-air', 'ruang-besar']);
const FASA4_CORRECT = new Set(['pengudaraan', 'kepadatan', 'pegangan']);
const FASA3_REQUIRED_SELECTIONS = FASA3_CORRECT.size;
const FASA4_REQUIRED_SELECTIONS = FASA4_CORRECT.size;

function initFasa3() {
  configureFasa3Content();
  setupOptionPhase(3, fasa3Selected, FASA3_REQUIRED_SELECTIONS);
  $('fasa3-submit').onclick = handleFasa3Submit;
}

function initFasa4() {
  configureFasa4Content();
  setupOptionPhase(4, fasa4Selected, FASA4_REQUIRED_SELECTIONS);
  $('fasa4-submit').onclick = handleFasa4Submit;
}

function setupOptionPhase(fasa, selectedSet, requiredSelections) {
  const hint = $(`fasa${fasa}-hint`);
  selectedSet.clear();
  if (hint) hint.textContent = '';
  setPlant(fasa, 'neutral');

  $$(`#fasa-${fasa} .st-option-btn`).forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected', 'correct-reveal', 'wrong-reveal');

    btn.onclick = () => {
      const val = btn.dataset.val;

      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedSet.delete(val);
      } else {
        btn.classList.add('selected');
        selectedSet.add(val);
      }

      setPlant(fasa, 'neutral');
      if (hint) {
        hint.textContent = selectedSet.size
          ? `${selectedSet.size}/${requiredSelections} pilihan dibuat. Tekan Semak Jawapan untuk menilai.`
          : '';
      }
    };
  });
}

function setPlant(fasa, state) {
  const root = $(`fasa-${fasa}`);
  const emoji  = root?.querySelector('.st-plant-emoji');
  const status = root?.querySelector('.st-plant-status');
  if (!emoji || !status) return;

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

function setFasaNotice(fasa, message) {
  const root = $(`fasa-${fasa}`);
  if (!root) return;

  let notice = root.querySelector('.st-fasa-notice');
  if (!notice) {
    notice = document.createElement('p');
    notice.className = 'st-fasa-notice';
    const button = root.querySelector('.st-next-btn');
    root.insertBefore(notice, button || null);
  }

  notice.textContent = message;
  notice.hidden = !message;
}

function configureFasa3Content() {
  const title = document.querySelector('#fasa-3 .st-fasa-title');
  const desc = document.querySelector('#fasa-3 .st-fasa-desc');
  const grid = $('fasa3-options-grid');

  if (title) title.textContent = 'Pernyataan Benar - Ciri Struktur Tanah Baik';
  if (desc) desc.innerHTML = 'Pilih <strong>2 pernyataan benar</strong> tentang ciri-ciri struktur tanah yang baik.';
  if (!grid) return;

  grid.innerHTML = `
    <button class="st-option-btn" data-val="lapisan-air" data-correct="true">
      Lapisan nipis air mengisi liang halus dalam agregat
    </button>
    <button class="st-option-btn" data-val="ruang-kecil" data-correct="false">
      Ruang kecil antara agregat membenarkan resapan gas dan pengaliran air
    </button>
    <button class="st-option-btn" data-val="mudah-terhakis" data-correct="false">
      Mudah terhakis
    </button>
    <button class="st-option-btn" data-val="ruang-besar" data-correct="true">
      Ruang besar antara agregat membenarkan resapan gas dan pengaliran air
    </button>
  `;
}

function configureFasa4Content() {
  const title = document.querySelector('#fasa-4 .st-fasa-title');
  const desc = document.querySelector('#fasa-4 .st-fasa-desc');
  const grid = $('fasa4-options-grid');

  if (title) title.textContent = 'Simulasi Kesan - Kepentingan Struktur Tanah';
  if (desc) desc.innerHTML = 'Pilih <strong>3 kepentingan</strong> struktur tanah yang betul untuk pokok tumbuh sihat.';
  if (!grid) return;

  grid.innerHTML = `
    <button class="st-option-btn" data-val="pengudaraan" data-correct="true">
      Memperbaiki pengudaraan tanah
    </button>
    <button class="st-option-btn" data-val="kepadatan" data-correct="true">
      Mencegah kepadatan tanah
    </button>
    <button class="st-option-btn" data-val="penyaliran" data-correct="false">
      Menghalang penyaliran air
    </button>
    <button class="st-option-btn" data-val="pegangan" data-correct="true">
      Mengekalkan daya pegangan air tanah
    </button>
  `;
}

function handleFasa3Submit() {
  checkOptionPhase({
    fasa: 3,
    selectedSet: fasa3Selected,
    correctAnswers: FASA3_CORRECT,
    requiredSelections: FASA3_REQUIRED_SELECTIONS,
    nextAction: () => {
      showFasa(4);
      initFasa4();
    },
  });
}

function handleFasa4Submit() {
  checkOptionPhase({
    fasa: 4,
    selectedSet: fasa4Selected,
    correctAnswers: FASA4_CORRECT,
    requiredSelections: FASA4_REQUIRED_SELECTIONS,
    nextAction: finishGame,
    buttonText: 'Makmal Selesai',
  });
}

function checkOptionPhase({ fasa, selectedSet, correctAnswers, requiredSelections, nextAction, buttonText = 'Seterusnya' }) {
  const hint = $(`fasa${fasa}-hint`);
  const submitBtn = $(`fasa${fasa}-submit`);

  if (selectedSet.size !== requiredSelections) {
    if (hint) hint.textContent = `Pilih tepat ${requiredSelections} jawapan.`;
    return;
  }

  let correctCount = 0;
  let wrongCount   = 0;

  $$(`#fasa-${fasa} .st-option-btn`).forEach(btn => {
    btn.disabled = true;
    const val       = btn.dataset.val;
    const isCorrect = correctAnswers.has(val);
    const wasSelected = selectedSet.has(val);

    if (wasSelected && isCorrect)  { btn.classList.add('correct-reveal'); correctCount++; }
    if (wasSelected && !isCorrect) { btn.classList.add('wrong-reveal');   wrongCount++;   }
    if (!wasSelected && isCorrect) { btn.classList.add('correct-reveal'); } // reveal missed
  });

  totalScore += correctCount;
  updateScoreDisplay();

  const missedCount = Math.max(0, requiredSelections - correctCount);
  const mistakeCount = wrongCount + missedCount;
  if (mistakeCount > 0) {
    window.AgriReviseGame?.playSound('wrong');
    const livesLeft = lives ? lives.lose(mistakeCount) : 1;
    if (livesLeft <= 0) return;
  } else {
    window.AgriReviseGame?.playSound('correct');
  }

  if (wrongCount === 0 && correctCount === requiredSelections) {
    setPlant(fasa, 'great');
  } else if (wrongCount > 0) {
    setPlant(fasa, 'sad');
    if (hint) hint.textContent = `${correctCount} betul, ${wrongCount} salah.`;
  } else {
    setPlant(fasa, 'happy');
  }

  submitBtn.textContent = 'Selesai';
  submitBtn.disabled = true;

  showFasaResultModal(fasa, correctCount, requiredSelections, nextAction, buttonText);
}

// =============================================
//  COMPLETE
// =============================================

function finishGame() {
  setProgress(TOTAL_FASA + 1);
  $('progress-fill').style.width = '100%';
  $('step-label').textContent = 'Selesai!';
  const totalQuestions = TOTAL_QUESTIONS;
  $('final-score-display').textContent = `${totalScore}/${totalQuestions}`;

  // Mark completed in localStorage so pemuliharaan page can unlock next card if needed
  localStorage.setItem('strukturTanahCompleted', 'true');
  localStorage.setItem('strukturTanahScore', totalScore);

  if (window.AgriReviseScores) {
    window.AgriReviseScores.saveScore('struktur_tanah', totalScore);
  }

  showFasa('complete');
}

function restartGame() {
  totalScore  = 0;
  updateScoreDisplay();
  currentFasa = 1;
  fasa1Checked = false;
  fasa2Checked = false;
  lives?.reset();

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

  // Reset fasa 3 and 4
  fasa3Selected.clear();
  fasa4Selected.clear();
  [3, 4].forEach(fasa => {
    $$(`#fasa-${fasa} .st-option-btn`).forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('selected', 'correct-reveal', 'wrong-reveal');
    });
    const submitBtn = $(`fasa${fasa}-submit`);
    const hint = $(`fasa${fasa}-hint`);
    if (submitBtn) {
      submitBtn.textContent = 'Semak Jawapan';
      submitBtn.disabled = false;
    }
    if (hint) hint.textContent = '';
    setPlant(fasa, 'neutral');
  });

  setProgress(1);
  showFasa(1);
}

// =============================================
//  BOOT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  lives = window.AgriReviseGame?.initLives();
  setProgress(1);
  updateScoreDisplay();
  initFasa1();
});

function showFasaResultModal(fasa, correct, total, nextAction, buttonText = 'Seterusnya') {
  const modal = $('fasa-result-modal');
  const title = $('fasa-result-title');
  const message = $('fasa-result-message');
  const nextBtn = $('fasa-result-next');

  title.textContent = `Fasa ${fasa} Selesai 🎉`;
  message.textContent = `Anda mendapat ${correct}/${total} betul (${Math.round((correct / total) * 100)}%)`;
  nextBtn.textContent = buttonText;

  modal.classList.remove('hidden');

  nextBtn.onclick = () => {
    modal.classList.add('hidden');
    nextAction();
  };
}
