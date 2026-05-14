(function () {
  const TOTAL_SCORE = 12;
  const TOTAL_STATIONS = 3;

  const state = {
    score: 0,
    currentStation: 1,
    selectedChip: null,
    touchChip: null,
    touchPreview: null,
    touchOffsetX: 0,
    touchOffsetY: 0,
    suppressClickUntil: 0,
    stationChecked: {
      1: false,
      2: false,
      3: false,
    },
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function setProgress(station) {
    const fill = $('#pht-progress-fill');
    const label = $('#pht-step-label');
    const pct = station === 'complete' ? 100 : ((station - 1) / TOTAL_STATIONS) * 100;

    fill.style.width = `${pct}%`;
    label.textContent = station === 'complete' ? 'Selesai!' : `Stesen ${station} / ${TOTAL_STATIONS}`;
  }

  function showStation(station) {
    $$('.pht-station').forEach((el) => el.classList.add('pht-hidden'));

    const next = station === 'complete'
      ? $('#pht-station-complete')
      : $(`#pht-station-${station}`);

    if (next) {
      next.classList.remove('pht-hidden');
    }

    state.currentStation = station;
    setProgress(station);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateScore(points) {
    state.score += points;
    $('#pht-score-display').textContent = state.score;
  }

  function showResultModal(title, message, nextAction, buttonText = 'Seterusnya') {
    const modal = $('#pht-result-modal');
    const nextBtn = $('#pht-result-next');

    $('#pht-result-title').textContent = title;
    $('#pht-result-message').textContent = message;
    nextBtn.textContent = buttonText;
    modal.classList.remove('pht-hidden');

    nextBtn.onclick = () => {
      modal.classList.add('pht-hidden');
      nextAction();
    };
  }

  function setFeedback(id, message, positive = false) {
    const el = $(id);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('pht-positive', positive);
  }

  function ensureHint(zone) {
    if (!zone || zone.querySelector('.pht-drop-hint') || zone.querySelector('.pht-draggable')) return;

    const hint = document.createElement('span');
    hint.className = 'pht-drop-hint';
    hint.textContent = zone.dataset.phtHint || 'Lepaskan di sini';
    zone.appendChild(hint);
  }

  function returnChipToBank(chip) {
    const previousZone = chip.closest('.pht-drop-zone');
    const bank = document.getElementById(chip.dataset.phtBank);

    if (bank) {
      bank.appendChild(chip);
    }

    ensureHint(previousZone);
  }

  function lockChips(scope) {
    $$('.pht-draggable', scope).forEach((chip) => {
      chip.draggable = false;
      chip.classList.add('pht-locked-chip');
    });
  }

  function clearSelectedChip() {
    if (state.selectedChip) {
      state.selectedChip.classList.remove('pht-selected-chip');
    }
    state.selectedChip = null;
  }

  function getDropZoneAt(clientX, clientY, chip) {
    if (state.touchPreview) {
      state.touchPreview.style.display = 'none';
    }

    const elementBelow = document.elementFromPoint(clientX, clientY);

    if (state.touchPreview) {
      state.touchPreview.style.display = '';
    }

    const zone = elementBelow?.closest('.pht-drop-zone');
    if (!zone || !chip || zone.dataset.phtGroup !== chip.dataset.phtGroup) {
      return null;
    }

    return zone;
  }

  function clearDragOverZones() {
    $$('.pht-drop-zone').forEach((zone) => zone.classList.remove('pht-drag-over'));
  }

  function startTouchDrag(event, chip) {
    if (chip.classList.contains('pht-locked-chip')) return;

    const touch = event.touches[0];
    const rect = chip.getBoundingClientRect();

    clearSelectedChip();
    state.touchChip = chip;
    state.selectedChip = chip;
    state.touchOffsetX = touch.clientX - rect.left;
    state.touchOffsetY = touch.clientY - rect.top;

    const preview = chip.cloneNode(true);
    preview.classList.add('pht-touch-preview');
    preview.style.width = `${rect.width}px`;
    preview.style.left = `${touch.clientX - state.touchOffsetX}px`;
    preview.style.top = `${touch.clientY - state.touchOffsetY}px`;
    document.body.appendChild(preview);

    state.touchPreview = preview;
    chip.classList.add('pht-dragging');
    event.preventDefault();
  }

  function moveTouchDrag(event) {
    if (!state.touchChip || !state.touchPreview) return;

    const touch = event.touches[0];
    state.touchPreview.style.left = `${touch.clientX - state.touchOffsetX}px`;
    state.touchPreview.style.top = `${touch.clientY - state.touchOffsetY}px`;

    clearDragOverZones();
    const zone = getDropZoneAt(touch.clientX, touch.clientY, state.touchChip);
    if (zone) {
      zone.classList.add('pht-drag-over');
    }

    event.preventDefault();
  }

  function endTouchDrag(event) {
    if (!state.touchChip) return;

    const chip = state.touchChip;
    const touch = event.changedTouches[0];
    const zone = touch ? getDropZoneAt(touch.clientX, touch.clientY, chip) : null;

    if (state.touchPreview) {
      state.touchPreview.remove();
    }

    chip.classList.remove('pht-dragging');
    clearDragOverZones();

    state.touchChip = null;
    state.touchPreview = null;
    state.suppressClickUntil = Date.now() + 450;

    if (zone) {
      placeChip(chip, zone);
    } else {
      clearSelectedChip();
    }
  }

  function placeChip(chip, zone) {
    if (!chip || !zone) return;
    if (chip.classList.contains('pht-locked-chip')) return;
    if (chip.dataset.phtGroup !== zone.dataset.phtGroup) return;

    const originZone = chip.closest('.pht-drop-zone');
    const existingChip = zone.querySelector('.pht-draggable');

    if (existingChip && existingChip !== chip) {
      returnChipToBank(existingChip);
    }

    const hint = zone.querySelector('.pht-drop-hint');
    if (hint) {
      hint.remove();
    }

    zone.classList.remove('pht-correct', 'pht-wrong');
    zone.appendChild(chip);

    if (originZone && originZone !== zone) {
      ensureHint(originZone);
    }

    clearSelectedChip();
  }

  function initDragAndDrop() {
    $$('.pht-draggable').forEach((chip) => {
      chip.addEventListener('dragstart', (event) => {
        if (chip.classList.contains('pht-locked-chip')) {
          event.preventDefault();
          return;
        }

        state.selectedChip = chip;
        chip.classList.add('pht-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', chip.dataset.phtAnswer);
      });

      chip.addEventListener('dragend', () => {
        chip.classList.remove('pht-dragging');
        clearDragOverZones();
      });

      chip.addEventListener('click', (event) => {
        event.stopPropagation();

        if (Date.now() < state.suppressClickUntil) return;
        if (chip.classList.contains('pht-locked-chip')) return;

        if (state.selectedChip === chip) {
          clearSelectedChip();
          return;
        }

        clearSelectedChip();
        state.selectedChip = chip;
        chip.classList.add('pht-selected-chip');
      });

      chip.addEventListener('touchstart', (event) => startTouchDrag(event, chip), { passive: false });
      chip.addEventListener('touchmove', moveTouchDrag, { passive: false });
      chip.addEventListener('touchend', endTouchDrag, { passive: false });
      chip.addEventListener('touchcancel', endTouchDrag, { passive: false });
    });

    $$('.pht-drop-zone').forEach((zone) => {
      zone.addEventListener('dragover', (event) => {
        event.preventDefault();
        zone.classList.add('pht-drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('pht-drag-over');
      });

      zone.addEventListener('drop', (event) => {
        event.preventDefault();
        zone.classList.remove('pht-drag-over');
        placeChip(state.selectedChip || $('.pht-dragging'), zone);
      });

      zone.addEventListener('click', () => {
        if (state.selectedChip) {
          placeChip(state.selectedChip, zone);
        }
      });
    });
  }

  function evaluateDropZones(scopeSelector) {
    const zones = $$(`${scopeSelector} .pht-drop-zone`);
    let correct = 0;

    zones.forEach((zone) => {
      const chip = zone.querySelector('.pht-draggable');
      zone.classList.remove('pht-correct', 'pht-wrong');

      if (chip && chip.dataset.phtAnswer === zone.dataset.phtAnswer) {
        zone.classList.add('pht-correct');
        correct += 1;
      } else {
        zone.classList.add('pht-wrong');
      }
    });

    return { correct, total: zones.length };
  }

  function countFilledDropZones(scopeSelector) {
    return $$(`${scopeSelector} .pht-drop-zone`).filter((zone) => zone.querySelector('.pht-draggable')).length;
  }

  function initStation1() {
    $('#pht-station-1-submit').addEventListener('click', () => {
      if (state.stationChecked[1]) {
        showStation(2);
        return;
      }

      if (countFilledDropZones('#pht-station-1') < 3) {
        setFeedback('#pht-station-1-feedback', 'Lengkapkan semua label pada carta pH dahulu.');
        return;
      }

      const result = evaluateDropZones('#pht-station-1');
      updateScore(result.correct);
      lockChips($('#pht-station-1'));
      state.stationChecked[1] = true;
      setFeedback('#pht-station-1-feedback', `${result.correct}/${result.total} label betul.`, result.correct === result.total);

      showResultModal(
        'Stesen 1 Selesai',
        `Anda mendapat ${result.correct}/${result.total} betul.`,
        () => showStation(2)
      );
    });
  }

  function initStation2() {
    const factors = $$('.pht-factor-card');

    factors.forEach((button) => {
      button.addEventListener('click', () => {
        if (state.stationChecked[2]) return;

        const selected = $$('.pht-factor-card.pht-stamped').length;
        if (!button.classList.contains('pht-stamped') && selected >= 3) {
          setFeedback('#pht-station-2-feedback', 'Pilih tepat 3 faktor sahaja.');
          return;
        }

        button.classList.toggle('pht-stamped');
        setFeedback('#pht-station-2-feedback', '');
      });
    });

    $('#pht-station-2-submit').addEventListener('click', () => {
      if (state.stationChecked[2]) {
        showStation(3);
        return;
      }

      const selectedFactors = $$('.pht-factor-card.pht-stamped');
      if (selectedFactors.length !== 3) {
        setFeedback('#pht-station-2-feedback', 'Cop tepat 3 faktor pH tanah dahulu.');
        return;
      }

      if (countFilledDropZones('#pht-effect-area') < 2) {
        setFeedback('#pht-station-2-feedback', 'Padankan kedua-dua kesan pH tanah dahulu.');
        return;
      }

      let factorCorrect = 0;
      factors.forEach((button) => {
        const isCorrect = button.dataset.phtCorrect === 'true';
        const isSelected = button.classList.contains('pht-stamped');

        button.disabled = true;
        button.classList.remove('pht-correct', 'pht-wrong');

        if (isCorrect) {
          button.classList.add('pht-correct');
        }

        if (isSelected && isCorrect) {
          factorCorrect += 1;
        }

        if (isSelected && !isCorrect) {
          button.classList.add('pht-wrong');
        }
      });

      const effectResult = evaluateDropZones('#pht-effect-area');
      const stationScore = factorCorrect + effectResult.correct;
      updateScore(stationScore);
      lockChips($('#pht-station-2'));
      state.stationChecked[2] = true;
      setFeedback('#pht-station-2-feedback', `${stationScore}/5 jawapan betul.`, stationScore === 5);

      showResultModal(
        'Stesen 2 Selesai',
        `Anda mendapat ${stationScore}/5 betul.`,
        () => showStation(3)
      );
    });
  }

  function runLabDemo() {
    const demo = $('#pht-lab-demo');
    const screen = $('#pht-meter-screen');
    const caption = $('#pht-demo-caption');

    demo.classList.add('pht-demo-run');
    screen.textContent = '4.1';
    caption.textContent = 'Meter pH dikalibrasi menggunakan larutan penampan.';

    window.setTimeout(() => {
      caption.textContent = 'Larutan tanah dikacau dan meter pH dimasukkan ke dalam bikar.';
      screen.textContent = '...';
    }, 1100);

    window.setTimeout(() => {
      screen.textContent = 'pH 6.5';
      caption.textContent = 'Bacaan pH tanah direkodkan dalam laporan eksperimen.';
    }, 2300);
  }

  function initStation3() {
    $('#pht-station-3-submit').addEventListener('click', () => {
        if (state.stationChecked[3]) {
        showResultModal(
          'Stesen 3 Selesai',
          'Keputusan stesen ini telah disemak.',
          finishGame,
          'Makmal Selesai'
        );
        return;
      }

      if (countFilledDropZones('#pht-station-3') < 4) {
        setFeedback('#pht-station-3-feedback', 'Susun semua 4 langkah prosedur dahulu.');
        return;
      }

      const result = evaluateDropZones('#pht-station-3');
      updateScore(result.correct);
      lockChips($('#pht-station-3'));
      state.stationChecked[3] = true;

      if (result.correct === result.total) {
        setFeedback('#pht-station-3-feedback', 'Urutan tepat. Simulasi meter pH diaktifkan.', true);
        runLabDemo();
      } else {
        setFeedback('#pht-station-3-feedback', `${result.correct}/${result.total} langkah betul.`, false);
      }

      const button = $('#pht-station-3-submit');
      const openFinalModal = () => {
        showResultModal(
          'Stesen 3 Selesai',
          `Anda mendapat ${result.correct}/${result.total} betul.`,
          finishGame,
          'Makmal Selesai'
        );
      };

      if (result.correct === result.total) {
        button.disabled = true;
        button.textContent = 'Simulasi berjalan...';
        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Semak Jawapan';
          openFinalModal();
        }, 2600);
      } else {
        button.textContent = 'Semak Jawapan';
        openFinalModal();
      }
    });
  }

  function finishGame() {
    const finalText = `${state.score}/${TOTAL_SCORE}`;
    $('#pht-final-score').textContent = finalText;
    localStorage.setItem('phTanahCompleted', 'true');
    localStorage.setItem('phTanahScore', String(state.score));
    if (window.AgriReviseScores) {
      window.AgriReviseScores.saveScore('ph_tanah', state.score);
    }
    showStation('complete');
  }

  document.addEventListener('DOMContentLoaded', () => {
    setProgress(1);
    initDragAndDrop();
    initStation1();
    initStation2();
    initStation3();
  });
})();
