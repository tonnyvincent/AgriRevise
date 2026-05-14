(function () {
  const TOTAL_QUESTIONS = 10;

  const questions = [
    {
      station: 'Stesen 1',
      title: 'Alat Pemugaran',
      desc: 'Kenal pasti alat untuk membaiki keadaan fizikal tanah.',
      method: 'Pemugaran',
      methodChip: 'Tanah dibajak',
      effect: 'plow',
      text: 'Alat pemugaran yang menggunakan piring atau cakera untuk memotong dan membalikkan tanah ialah...',
      answer: 'Bajak Piring',
      options: ['Bajak Putar', 'Bajak Sisir', 'Bajak Piring', 'Bajak Sikat']
    },
    {
      station: 'Stesen 1',
      title: 'Bekalan Air',
      desc: 'Pulihkan tanah kering dengan kaedah air yang betul.',
      method: 'Pengairan',
      methodChip: 'Air dibekalkan',
      effect: 'water',
      text: 'Pengairan ialah kaedah ______ atau membekalkan air kepada tanaman.',
      answer: 'Penyiraman',
      options: ['Pembajaan', 'Penyiraman', 'Penyiraman titis', 'Pengairan percikan']
    },
    {
      station: 'Stesen 1',
      title: 'Parit Ladang',
      desc: 'Keluarkan air berlebihan supaya akar tidak lemas.',
      method: 'Penyaliran',
      methodChip: 'Air bertakung surut',
      effect: 'drain',
      text: 'Sistem parit yang bercabang seperti tulang ikan dikenali sebagai...',
      answer: 'Sistem Parit Tulang Hering',
      options: ['Sistem Parit Tulang Hering', 'Sistem Parit Rawak', 'Sistem Parit Selari', 'Sistem Parit Lurus']
    },
    {
      station: 'Stesen 2',
      title: 'Jenis Pengairan',
      desc: 'Padankan pernyataan dengan sistem pengairan.',
      method: 'Pengairan',
      methodChip: 'Pengairan banjir',
      effect: 'water',
      text: 'Air dilepaskan ke kawasan tanaman dengan menggunakan pam air. Pernyataan ini merujuk kepada...',
      answer: 'Sistem Pengairan Banjir',
      options: ['Sistem Pengairan Percikan', 'Sistem Pengairan Banjir', 'Sistem Pengairan Titisan', 'Sistem Parit Selari']
    },
    {
      station: 'Stesen 2',
      title: 'Pemugaran Sekunder',
      desc: 'Baiki struktur tanah selepas pembajakan awal.',
      method: 'Pemugaran',
      methodChip: 'Tanah digembur',
      effect: 'plow',
      text: 'Tujuan utama pemugaran sekunder ialah...',
      answer: 'Menggaul sisa tanaman dengan baja dan menggemburkan tanah',
      options: ['Menggaul sisa tanaman dengan baja dan menggemburkan tanah', 'Memotong dan membalikkan tanah', 'Menghakis tanah', 'Memecahkan lapisan tanah keras']
    },
    {
      station: 'Stesen 2',
      title: 'Batas Tanaman',
      desc: 'Gunakan mekanisasi ladang mengikut fungsi.',
      method: 'Pemugaran',
      methodChip: 'Batas dibentuk',
      effect: 'plow',
      text: 'Fungsi alat mekanisasi ladang untuk penyediaan batas ialah...',
      answer: 'Membuat batas dan alur antara batas',
      options: ['Membuat batas dan alur antara batas', 'Memecahkan ketulan tanah besar', 'Menghancurkan tanah menjadi debu', 'Mengeluarkan rumpai sahaja']
    },
    {
      station: 'Stesen 3',
      title: 'Sebelum Pengapuran',
      desc: 'Stabilkan pH tanah dengan keputusan yang tepat.',
      method: 'Pengapuran',
      methodChip: 'Kapur ditabur',
      effect: 'lime',
      text: 'Antara berikut, yang manakah bukan faktor yang perlu dipertimbangkan sebelum pengapuran?',
      answer: 'Jenis Baja',
      options: ['Jenis Tanah', 'Jenis Baja', 'Jenis Tanaman', 'Jenis Kapur']
    },
    {
      station: 'Stesen 3',
      title: 'Nutrien Tanah',
      desc: 'Pulihkan tanah miskin nutrien.',
      method: 'Pembajaan',
      methodChip: 'Nutrien ditambah',
      effect: 'fertilizer',
      text: 'Kaedah memperbaiki tanah dengan menambah nutrien kepada tanaman ialah...',
      answer: 'Pembajaan',
      options: ['Pengapuran', 'Pengairan', 'Pemugaran', 'Pembajaan']
    },
    {
      station: 'Stesen 3',
      title: 'pH Rendah',
      desc: 'Kurangkan keadaan tanah terlalu berasid.',
      method: 'Pengapuran',
      methodChip: 'pH semakin stabil',
      effect: 'lime',
      text: 'Nilai pH tanah yang rendah memudahkan patogen penyakit merebak. Kaedah terbaik untuk mengatasinya ialah...',
      answer: 'Pengapuran',
      options: ['Pemugaran', 'Pembajaan', 'Pengapuran', 'Penyaliran']
    },
    {
      station: 'Stesen 3',
      title: 'Masa Pengapuran',
      desc: 'Tentukan masa pengapuran sebelum menanam.',
      method: 'Pengapuran',
      methodChip: 'Tanah sedia ditanam',
      effect: 'lime',
      text: 'Pengapuran dilakukan sekurang-kurangnya ______ sebelum menanam semasa pembajakan.',
      answer: '2 minggu',
      options: ['3 minggu', '5 minggu', '4 minggu', '2 minggu']
    }
  ];

  const state = {
    index: 0,
    score: 0,
    selected: '',
    answered: false
  };

  const $ = (selector) => document.querySelector(selector);

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function updateProgress(answeredCount = state.index) {
    const percent = Math.min(100, (answeredCount / TOTAL_QUESTIONS) * 100);
    $('#kmt-progress-fill').style.width = `${percent}%`;
    setText('#kmt-score-display', state.score);
    setText('#kmt-step-label', `Soalan ${Math.min(state.index + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`);
  }

  function updateHealth() {
    const ratio = state.score / TOTAL_QUESTIONS;
    const health = Math.round(ratio * 100);
    const scene = $('#kmt-soil-scene');
    scene.style.setProperty('--kmt-health-ratio', ratio.toFixed(2));
    scene.dataset.kmtHealth = String(state.score);
    setText('#kmt-health-text', `${health}%`);
  }

  function renderQuestion() {
    const question = questions[state.index];
    state.selected = '';
    state.answered = false;

    setText('#kmt-station-badge', question.station);
    setText('#kmt-station-title', question.title);
    setText('#kmt-station-desc', question.desc);
    setText('#kmt-method-label', `Kaedah: ${question.method}`);
    setText('#kmt-method-chip', question.methodChip);
    setText('#kmt-question-count', `${state.index + 1}/${TOTAL_QUESTIONS}`);
    setText('#kmt-question-text', question.text);
    setText('#kmt-feedback', '');

    const options = $('#kmt-option-grid');
    options.innerHTML = question.options
      .map((option) => `<button class="kmt-option-btn" type="button" data-kmt-option="${option}">${option}</button>`)
      .join('');

    const submit = $('#kmt-submit-btn');
    submit.disabled = false;
    submit.textContent = 'Semak Jawapan';

    updateProgress(state.index);
  }

  function createParticles(effect) {
    const particles = $('#kmt-particles');
    const count = effect === 'plow' ? 18 : 22;
    const palette = {
      water: ['#4fc3f7', '#81d4fa', '#b3e5fc'],
      drain: ['#4fc3f7', '#80cbc4', '#a5d6a7'],
      lime: ['#ffffff', '#f1f8e9', '#dcedc8'],
      fertilizer: ['#66bb6a', '#ffb74d', '#8bc34a'],
      plow: ['#8d6e63', '#a1887f', '#6d4c41']
    }[effect] || ['#a5d6a7'];

    particles.innerHTML = '';

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'kmt-particle';
      dot.style.setProperty('--kmt-x', `${8 + Math.random() * 84}%`);
      dot.style.setProperty('--kmt-size', `${4 + Math.random() * 5}px`);
      dot.style.setProperty('--kmt-drift', `${-18 + Math.random() * 36}px`);
      dot.style.setProperty('--kmt-color', palette[i % palette.length]);
      dot.style.animationDelay = `${Math.random() * 0.2}s`;
      particles.appendChild(dot);
    }

    window.setTimeout(() => {
      particles.innerHTML = '';
    }, 1200);
  }

  function triggerAnimation(effect, correct) {
    const scene = $('#kmt-soil-scene');
    scene.classList.remove('kmt-effect-water', 'kmt-effect-drain', 'kmt-effect-lime', 'kmt-effect-fertilizer', 'kmt-effect-plow', 'kmt-improved', 'kmt-wrong');
    void scene.offsetWidth;

    if (!correct) {
      scene.classList.add('kmt-wrong');
      return;
    }

    scene.classList.add(`kmt-effect-${effect}`, 'kmt-improved');
    createParticles(effect);
  }

  function evaluateAnswer() {
    const question = questions[state.index];
    const optionButtons = [...document.querySelectorAll('.kmt-option-btn')];
    const correct = state.selected === question.answer;

    optionButtons.forEach((button) => {
      const isAnswer = button.dataset.kmtOption === question.answer;
      const isSelected = button.dataset.kmtOption === state.selected;

      button.disabled = true;
      button.classList.toggle('kmt-correct', isAnswer);
      button.classList.toggle('kmt-wrong', isSelected && !correct);
    });

    if (correct) {
      state.score += 1;
      updateHealth();
      triggerAnimation(question.effect, true);
      $('#kmt-feedback').classList.add('kmt-good');
      setText('#kmt-feedback', 'Betul. Tanah semakin sihat.');
    } else {
      triggerAnimation(question.effect, false);
      $('#kmt-feedback').classList.remove('kmt-good');
      setText('#kmt-feedback', `Jawapan betul: ${question.answer}`);
    }

    state.answered = true;
    updateProgress(state.index + 1);

    if (state.index === TOTAL_QUESTIONS - 1) {
      const submit = $('#kmt-submit-btn');
      submit.disabled = true;
      submit.textContent = 'Makmal Selesai';
      window.setTimeout(finishGame, correct ? 1150 : 750);
      return;
    }

    $('#kmt-submit-btn').textContent = 'Soalan Seterusnya';
  }

  function finishGame() {
    const finalScore = `${state.score}/${TOTAL_QUESTIONS}`;
    setText('#kmt-final-score', finalScore);
    localStorage.setItem('kaedahMemperbaikiTanahCompleted', 'true');
    localStorage.setItem('kaedahMemperbaikiTanahScore', String(state.score));
    if (window.AgriReviseScores) {
      window.AgriReviseScores.saveScore('kaedah_memperbaiki_tanah', state.score);
    }
    $('#kmt-completion-modal').classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();
    updateHealth();

    $('#kmt-option-grid').addEventListener('click', (event) => {
      const button = event.target.closest('.kmt-option-btn');
      if (!button || state.answered) return;

      state.selected = button.dataset.kmtOption;
      document.querySelectorAll('.kmt-option-btn').forEach((item) => item.classList.remove('kmt-selected'));
      button.classList.add('kmt-selected');
      $('#kmt-feedback').classList.remove('kmt-good');
      setText('#kmt-feedback', '');
    });

    $('#kmt-submit-btn').addEventListener('click', () => {
      if (state.answered) {
        state.index += 1;
        renderQuestion();
        return;
      }

      if (!state.selected) {
        $('#kmt-feedback').classList.remove('kmt-good');
        setText('#kmt-feedback', 'Pilih satu jawapan dahulu.');
        return;
      }

      evaluateAnswer();
    });
  });
})();
