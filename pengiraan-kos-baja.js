(function () {
  const TOTAL_MISSIONS = 10;
  const WEIGHT_FORMULA = 'Berat baja = (Keperluan nutrien / Peratus nutrien dalam baja) x 100';
  const COST_FORMULA = 'Kos baja = (Berat baja diperlukan / 50 kg) x Harga 1 beg baja';

  const missions = [
    {
      mode: 'choice',
      badge: 'Misi 1',
      title: 'Misi Tabur & Subur',
      desc: 'Bekalkan Nitrogen secukupnya kepada ladang.',
      type: 'Pesanan Kerja',
      formula: WEIGHT_FORMULA,
      question: 'Petani menggunakan baja Urea yang mengandungi 46% Nitrogen (N). Berapakah kuantiti baja Urea yang diperlukan untuk membekalkan 80 kg Nitrogen (N)?',
      answer: 'C',
      answerText: '174 kg',
      options: [
        { key: 'A', value: '150 kg', hint: 'Terlalu rendah' },
        { key: 'B', value: '160 kg', hint: 'Hampir' },
        { key: 'C', value: '174 kg', hint: 'Tepat' },
        { key: 'D', value: '184 kg', hint: 'Terlalu tinggi' }
      ]
    },
    {
      mode: 'choice',
      badge: 'Misi 2',
      title: 'Fosfat Untuk Akar',
      desc: 'Pilih kuantiti Triple Super Phosphate yang betul.',
      type: 'Pesanan Kerja',
      formula: WEIGHT_FORMULA,
      question: 'Triple Super Phosphate mengandungi 44% P2O5. Hitungkan kuantiti baja yang diperlukan untuk membekalkan 100 kg P2O5.',
      answer: 'B',
      answerText: '227 kg',
      options: [
        { key: 'A', value: '200 kg', hint: 'Tidak cukup' },
        { key: 'B', value: '227 kg', hint: 'Tepat' },
        { key: 'C', value: '250 kg', hint: 'Berlebihan' },
        { key: 'D', value: '300 kg', hint: 'Terlalu tinggi' }
      ]
    },
    {
      mode: 'choice',
      badge: 'Misi 3',
      title: 'Kalium Untuk Tanaman',
      desc: 'Gunakan Muriate of Potash untuk membekalkan K2O.',
      type: 'Pesanan Kerja',
      formula: WEIGHT_FORMULA,
      question: 'Seorang petani ingin membekalkan 120 kg K2O kepada tanaman menggunakan baja Muriate of Potash yang mengandungi 60% K2O. Berapakah kuantiti baja yang diperlukan?',
      answer: 'B',
      answerText: '200 kg',
      options: [
        { key: 'A', value: '180 kg', hint: 'Tidak cukup' },
        { key: 'B', value: '200 kg', hint: 'Tepat' },
        { key: 'C', value: '220 kg', hint: 'Berlebihan' },
        { key: 'D', value: '240 kg', hint: 'Terlalu tinggi' }
      ]
    },
    {
      mode: 'choice',
      badge: 'Misi 4',
      title: 'Nutrien Dibekalkan',
      desc: 'Kira nutrien yang dibekalkan oleh baja.',
      type: 'Pesanan Kerja',
      formula: 'Nutrien dibekalkan = Berat baja x Peratus nutrien dalam baja',
      question: 'Petani menggunakan 100 kg baja Urea yang mengandungi 46% Nitrogen (N). Berapakah kuantiti Nitrogen (N) yang dibekalkan oleh baja tersebut?',
      answer: 'B',
      answerText: '46 kg',
      options: [
        { key: 'A', value: '40 kg', hint: 'Tidak tepat' },
        { key: 'B', value: '46 kg', hint: 'Tepat' },
        { key: 'C', value: '50 kg', hint: 'Terlalu tinggi' },
        { key: 'D', value: '54 kg', hint: 'Terlalu tinggi' }
      ]
    },
    {
      mode: 'choice',
      badge: 'Misi 5',
      title: 'Jumlah K2O',
      desc: 'Analisis jumlah nutrien daripada baja yang digunakan.',
      type: 'Pesanan Kerja',
      formula: 'Nutrien dibekalkan = Berat baja x Peratus nutrien dalam baja',
      question: 'Sebuah kebun menggunakan 200 kg baja Muriate of Potash yang mengandungi 60% K2O. Berapakah jumlah K2O yang dibekalkan kepada tanaman?',
      answer: 'C',
      answerText: '120 kg',
      options: [
        { key: 'A', value: '100 kg', hint: 'Tidak cukup' },
        { key: 'B', value: '110 kg', hint: 'Hampir' },
        { key: 'C', value: '120 kg', hint: 'Tepat' },
        { key: 'D', value: '140 kg', hint: 'Berlebihan' }
      ]
    },
    {
      mode: 'cash',
      badge: 'Misi 6',
      title: 'Pengurus Gudang Baja',
      desc: 'Masukkan jumlah kos pada mesin juruwang.',
      type: 'Pesanan Belian',
      formula: COST_FORMULA,
      item: 'Baja Urea',
      quantity: '43.48 kg',
      rate: 'RM120.00 / 50kg',
      question: 'Diminta: 43.48 kg baja Urea. Harga semasa: RM120.00 bagi 50 kg. Masukkan jumlah kos yang tepat.',
      answer: '104.35'
    },
    {
      mode: 'cash',
      badge: 'Misi 7',
      title: 'Pesanan NPK',
      desc: 'Sahkan kos sebelum lori bergerak.',
      type: 'Pesanan Belian',
      formula: COST_FORMULA,
      item: 'Baja NPK',
      quantity: '250 kg',
      rate: 'RM180.00 / 50kg',
      question: 'Harga 1 beg baja NPK seberat 50 kg ialah RM180.00. Hitungkan kos bagi 250 kg baja NPK tersebut.',
      answer: '900.00'
    },
    {
      mode: 'cash',
      badge: 'Misi 8',
      title: 'Stok Urea Tambahan',
      desc: 'Kira kos berdasarkan berat baja yang diperlukan.',
      type: 'Pesanan Belian',
      formula: COST_FORMULA,
      item: 'Baja Urea',
      quantity: '271.74 kg',
      rate: 'RM55.00 / 50kg',
      question: 'Seorang petani memerlukan 271.74 kg baja Urea. Jika harga 50 kg baja Urea ialah RM55.00, berapakah jumlah kos yang perlu dibayar?',
      answer: '298.91'
    },
    {
      mode: 'cash',
      badge: 'Misi 9',
      title: 'Baja CIRP',
      desc: 'Luluskan kos pembelian ladang.',
      type: 'Pesanan Belian',
      formula: COST_FORMULA,
      item: 'Baja CIRP',
      quantity: '500 kg',
      rate: 'RM45.00 / 50kg',
      question: 'Sebuah ladang menggunakan 500 kg baja CIRP. Jika harga bagi 50 kg baja CIRP ialah RM45.00, apakah jumlah kos yang diperlukan?',
      answer: '450.00'
    },
    {
      mode: 'cash',
      badge: 'Misi 10',
      title: 'Muriate of Potash',
      desc: 'Kira kos keseluruhan untuk kebun.',
      type: 'Pesanan Belian',
      formula: COST_FORMULA,
      item: 'Muriate of Potash',
      quantity: '300 kg',
      rate: 'RM70.00 / 50kg',
      question: 'Harga 50 kg baja Muriate of Potash ialah RM70.00. Jika sebuah kebun memerlukan 300 kg baja tersebut, berapakah jumlah kos keseluruhan?',
      answer: '420.00'
    }
  ];

  const state = {
    index: 0,
    completed: 0,
    score: 0,
    selected: '',
    cashInput: '',
    solved: false
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function currentMission() {
    return missions[state.index];
  }

  function resetSceneClasses() {
    const scene = $('#jb-scene');
    scene.classList.remove('jb-correct-choice', 'jb-correct-cash', 'jb-wrong', 'jb-lorry-arrive');
    void scene.offsetWidth;
  }

  function updateProgress() {
    const pct = (state.completed / TOTAL_MISSIONS) * 100;
    $('#jb-progress-fill').style.width = `${pct}%`;
    setText('#jb-score-display', state.score);
    setText('#jb-step-label', `Misi ${Math.min(state.index + 1, TOTAL_MISSIONS)} / ${TOTAL_MISSIONS}`);
  }

  function updateField() {
    const ratio = state.completed / TOTAL_MISSIONS;
    const scene = $('#jb-scene');
    scene.style.setProperty('--jb-progress', ratio.toFixed(2));
    scene.style.setProperty('--jb-progress-percent', `${Math.round(ratio * 100)}%`);
    scene.style.setProperty('--jb-sun-opacity', (0.25 + ratio * 0.65).toFixed(2));
    scene.style.setProperty('--jb-field-opacity', (0.08 + ratio * 0.88).toFixed(2));
    scene.style.setProperty('--jb-plant-opacity', (0.14 + ratio * 0.86).toFixed(2));
    scene.style.setProperty('--jb-plant-scale', (0.28 + ratio * 0.72).toFixed(2));
    scene.style.setProperty('--jb-tractor-x', `${Math.round(ratio * 168)}px`);
    scene.style.setProperty('--jb-tractor-start-x', `${Math.round(ratio * 150 - 52)}px`);
    setText('#jb-field-percent', `${Math.round(ratio * 100)}%`);
  }

  function setFeedback(message, positive = false) {
    const feedback = $('#jb-feedback');
    feedback.textContent = message;
    feedback.classList.toggle('jb-good', positive);
  }

  function setCashDisplay() {
    setText('#jb-cash-display', `RM ${state.cashInput || '0'}`);
  }

  function renderChoices(mission) {
    const grid = $('#jb-choice-grid');
    grid.innerHTML = mission.options.map((option) => (
      `<button class="jb-choice-btn" type="button" data-jb-key="${option.key}">` +
      `<strong>${option.value}</strong><span>${option.hint}</span></button>`
    )).join('');
  }

  function renderMission() {
    const mission = currentMission();
    state.selected = '';
    state.cashInput = '';
    state.solved = false;

    resetSceneClasses();
    $('#jb-fertilizer-dust').innerHTML = '';
    $('#jb-game-card').classList.toggle('jb-cash-mode', mission.mode === 'cash');
    $('#jb-scene').classList.toggle('jb-scene-warehouse', mission.mode === 'cash');
    if (mission.mode === 'cash') {
      const scene = $('#jb-scene');
      void scene.offsetWidth;
      scene.classList.add('jb-lorry-arrive');
    }
    $('#jb-formula-card').classList.add('jb-hidden');
    $('#jb-choice-grid').classList.toggle('jb-hidden', mission.mode !== 'choice');
    $('#jb-cash-panel').classList.toggle('jb-hidden', mission.mode !== 'cash');

    setText('#jb-mission-badge', mission.badge);
    setText('#jb-mission-title', mission.title);
    setText('#jb-mission-desc', mission.desc);
    setText('#jb-order-type', mission.type);
    setText('#jb-question-count', `${state.index + 1}/${TOTAL_MISSIONS}`);
    setText('#jb-question-text', mission.question);
    setText('#jb-formula-text', mission.formula);
    setText('#jb-feedback', '');

    if (mission.mode === 'choice') {
      renderChoices(mission);
      $('#jb-submit-btn').textContent = 'Semak Jawapan';
    } else {
      const cashMissionNumber = state.index - 4;
      setText('#jb-warehouse-item', mission.item);
      setText('#jb-warehouse-qty', mission.quantity);
      setText('#jb-po-item', mission.item);
      setText('#jb-po-weight', mission.quantity);
      setText('#jb-po-rate', mission.rate);
      setText('#jb-po-number', `Pesanan ${cashMissionNumber}/5`);
      setCashDisplay();
      $('#jb-submit-btn').textContent = 'Luluskan';
    }

    $('#jb-submit-btn').disabled = false;
    updateProgress();
    updateField();
  }

  function createParticles() {
    const dust = $('#jb-fertilizer-dust');
    const colors = ['#66bb6a', '#ffb74d', '#f6e4a5', '#8bc34a'];
    dust.innerHTML = '';

    for (let i = 0; i < 24; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'jb-particle';
      particle.style.setProperty('--jb-x', `${16 + Math.random() * 70}%`);
      particle.style.setProperty('--jb-size', `${4 + Math.random() * 5}px`);
      particle.style.setProperty('--jb-drift', `${-18 + Math.random() * 36}px`);
      particle.style.setProperty('--jb-color', colors[i % colors.length]);
      particle.style.animationDelay = `${Math.random() * 0.18}s`;
      dust.appendChild(particle);
    }

    window.setTimeout(() => {
      dust.innerHTML = '';
    }, 1100);
  }

  function triggerWrongAnimation() {
    resetSceneClasses();
    $('#jb-scene').classList.add('jb-wrong');
  }

  function triggerCorrectAnimation(mode) {
    resetSceneClasses();

    if (mode === 'choice') {
      $('#jb-scene').classList.add('jb-correct-choice');
      createParticles();
      return;
    }

    $('#jb-scene').classList.add('jb-correct-cash');
  }

  function completeMission(correct = true, feedbackMessage = '') {
    const mission = currentMission();

    if (correct) {
      state.score += 1;
    }

    state.completed += 1;
    state.solved = true;
    updateProgress();
    updateField();

    if (correct) {
      triggerCorrectAnimation(mission.mode);
      setFeedback(mission.mode === 'choice' ? 'Betul. Traktor menabur baja ke ladang.' : 'Kos tepat. Trak menghantar pesanan.', true);
    } else {
      triggerWrongAnimation();
      setFeedback(feedbackMessage);
    }

    if (mission.mode === 'choice') {
      $$('.jb-choice-btn').forEach((button) => {
        button.disabled = true;
        button.classList.toggle('jb-correct', button.dataset.jbKey === mission.answer);
        button.classList.toggle('jb-wrong', button.dataset.jbKey === state.selected && !correct);
      });
    }

    if (state.index === TOTAL_MISSIONS - 1) {
      $('#jb-submit-btn').disabled = true;
      $('#jb-submit-btn').textContent = 'Game Selesai';
      window.setTimeout(finishGame, 1250);
      return;
    }

    $('#jb-submit-btn').textContent = 'Misi Seterusnya';
  }

  function evaluateChoice() {
    const mission = currentMission();

    if (!state.selected) {
      setFeedback('Pilih satu guni baja dahulu.');
      return;
    }

    $$('.jb-choice-btn').forEach((button) => {
      button.classList.remove('jb-wrong', 'jb-correct');
      if (button.dataset.jbKey === mission.answer) {
        button.classList.add('jb-correct');
      }
    });

    if (state.selected === mission.answer) {
      completeMission();
      return;
    }

    const selectedButton = $(`.jb-choice-btn[data-jb-key="${state.selected}"]`);
    if (selectedButton) selectedButton.classList.add('jb-wrong');
    completeMission(false, `Salah. Jawapan betul: ${mission.answer}. ${mission.answerText}.`);
  }

  function normalizeCash(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return '';
    return numeric.toFixed(2);
  }

  function evaluateCash() {
    const mission = currentMission();
    const normalized = normalizeCash(state.cashInput);

    if (!state.cashInput) {
      setFeedback('Masukkan jumlah kos pada pad kekunci.');
      return;
    }

    if (normalized === mission.answer) {
      completeMission();
      return;
    }

    completeMission(false, `Salah. Jawapan betul: RM ${mission.answer}.`);
  }

  function handleSubmit() {
    if (state.solved) {
      state.index += 1;
      renderMission();
      return;
    }

    const mission = currentMission();

    if (mission.mode === 'choice') {
      evaluateChoice();
      return;
    }

    evaluateCash();
  }

  function handleKeypad(key) {
    if (state.solved) return;

    if (key === 'back') {
      state.cashInput = state.cashInput.slice(0, -1);
      setCashDisplay();
      setFeedback('');
      return;
    }

    if (key === '.') {
      if (state.cashInput.includes('.')) return;
      state.cashInput = state.cashInput ? `${state.cashInput}.` : '0.';
      setCashDisplay();
      setFeedback('');
      return;
    }

    if (state.cashInput.replace('.', '').length >= 7) return;
    state.cashInput = state.cashInput === '0' ? key : `${state.cashInput}${key}`;
    setCashDisplay();
    setFeedback('');
  }

  function finishGame() {
    const finalScore = `${state.score}/${TOTAL_MISSIONS}`;
    setText('#jb-final-score', finalScore);
    localStorage.setItem('pengiraanKosBajaCompleted', 'true');
    localStorage.setItem('pengiraanKosBajaScore', String(state.score));
    if (window.AgriReviseScores) {
      window.AgriReviseScores.saveScore('pengiraan_kos_baja', state.score);
    }
    $('#jb-completion-modal').classList.remove('jb-hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderMission();

    $('#jb-choice-grid').addEventListener('click', (event) => {
      const button = event.target.closest('.jb-choice-btn');
      if (!button || state.solved) return;

      state.selected = button.dataset.jbKey;
      $$('.jb-choice-btn').forEach((item) => item.classList.remove('jb-selected', 'jb-wrong'));
      button.classList.add('jb-selected');
      setFeedback('');
    });

    $('#jb-keypad').addEventListener('click', (event) => {
      const button = event.target.closest('.jb-key-btn');
      if (!button) return;
      handleKeypad(button.dataset.jbKey);
    });

    $('#jb-clear-btn').addEventListener('click', () => {
      if (state.solved) return;
      state.cashInput = '';
      setCashDisplay();
      setFeedback('');
    });

    $('#jb-formula-btn').addEventListener('click', () => {
      $('#jb-formula-card').classList.toggle('jb-hidden');
    });

    $('#jb-submit-btn').addEventListener('click', handleSubmit);
  });
})();
