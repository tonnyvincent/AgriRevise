(function () {
  const TOTAL_QUESTIONS = 14;

  const questions = [
    {
      badge: 'Misi 1',
      title: 'Cabaran Ladang',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Konsep',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'chemical',
      question: 'Antara berikut, yang manakah jenis baja kimia?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Sisa haiwan' },
        { key: 'B', text: 'Baja tunggal' },
        { key: 'C', text: 'Sisa ladang' },
        { key: 'D', text: 'Kompos' }
      ]
    },
    {
      badge: 'Misi 2',
      title: 'Uji Pemerhatian',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Kenal Pasti',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'organic',
      question: 'Baja organik diperoleh daripada sumber berikut kecuali...',
      answer: 'D',
      options: [
        { key: 'A', text: 'Sisa haiwan' },
        { key: 'B', text: 'Sisa kilang' },
        { key: 'C', text: 'Sisa ladang' },
        { key: 'D', text: 'Urea' }
      ]
    },
    {
      badge: 'Misi 3',
      title: 'Pilih Dengan Teliti',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Bandingkan',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'mixed',
      question: 'Apakah perbezaan utama antara baja campuran dan baja sebatian?',
      answer: 'C',
      options: [
        { key: 'A', text: 'Baja campuran lebih mahal' },
        { key: 'B', text: 'Baja campuran dihasilkan secara kimia' },
        { key: 'C', text: 'Baja campuran secara fizikal, baja sebatian secara kimia' },
        { key: 'D', text: 'Tiada perbezaan' }
      ]
    },
    {
      badge: 'Misi 4',
      title: 'Situasi Petani',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Situasi',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'mixed',
      question: 'Seorang petani mencampurkan beberapa jenis baja tanpa tindak balas kimia. Apakah jenis baja tersebut?',
      answer: 'C',
      options: [
        { key: 'A', text: 'Baja sebatian' },
        { key: 'B', text: 'Baja tunggal' },
        { key: 'C', text: 'Baja campuran' },
        { key: 'D', text: 'Baja organik' }
      ]
    },
    {
      badge: 'Misi 5',
      title: 'Semak Konsep',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Kefahaman',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'organic',
      question: 'Baja organik membantu meningkatkan kandungan apa dalam tanah?',
      answer: 'C',
      options: [
        { key: 'A', text: 'Logam berat' },
        { key: 'B', text: 'Racun' },
        { key: 'C', text: 'Nutrien' },
        { key: 'D', text: 'Plastik' }
      ]
    },
    {
      badge: 'Misi 6',
      title: 'Kaji Situasi',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Kefahaman',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'organic',
      question: 'Bagaimanakah baja organik membantu meningkatkan kandungan mikrob dalam tanah?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Membunuh semua mikrob' },
        { key: 'B', text: 'Menyediakan makanan kepada mikrob' },
        { key: 'C', text: 'Mengeringkan tanah' },
        { key: 'D', text: 'Mengurangkan bahan organik' }
      ]
    },
    {
      badge: 'Misi 7',
      title: 'Keputusan Ladang',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Situasi',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'organic',
      question: 'Tanah tidak dapat menyimpan air dengan baik. Apakah penyelesaian sesuai?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Tambah pasir sahaja' },
        { key: 'B', text: 'Gunakan baja organik' },
        { key: 'C', text: 'Kurangkan baja' },
        { key: 'D', text: 'Biarkan tanah kering' }
      ]
    },
    {
      badge: 'Misi 8',
      title: 'Pilihan Bijak',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Risiko',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'warning',
      question: 'Antara berikut, yang manakah kesan sampingan baja organik?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Mengurangkan rumpai' },
        { key: 'B', text: 'Menggalakkan pertumbuhan rumpai' },
        { key: 'C', text: 'Menghapuskan perosak' },
        { key: 'D', text: 'Mensterilkan tanah' }
      ]
    },
    {
      badge: 'Misi 9',
      title: 'Fikir Dahulu',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Sebab',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'organic',
      question: 'Mengapakah baja organik meresap lambat ke dalam tanah?',
      answer: 'A',
      options: [
        { key: 'A', text: 'Mengandungi bahan organik yang perlu terurai dahulu' },
        { key: 'B', text: 'Mengandungi bahan kimia kuat' },
        { key: 'C', text: 'Tidak larut dalam air' },
        { key: 'D', text: 'Tidak digunakan dalam pertanian' }
      ]
    },
    {
      badge: 'Misi 10',
      title: 'Banding Pilihan',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Bandingkan',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'chemical',
      question: 'Mengapakah baja kimia cepat bertindak berbanding baja organik?',
      answer: 'C',
      options: [
        { key: 'A', text: 'Tidak larut dalam air' },
        { key: 'B', text: 'Nutriennya lambat dilepaskan' },
        { key: 'C', text: 'Mudah larut dan cepat diserap oleh akar' },
        { key: 'D', text: 'Tidak mengandungi bahan kimia' }
      ]
    },
    {
      badge: 'Misi 11',
      title: 'Pilih Strategi',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Aplikasi',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'chemical',
      question: 'Seorang petani memilih baja tertentu untuk tanaman berbunga. Apakah kelebihan baja kimia dalam situasi ini?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Tidak boleh disesuaikan' },
        { key: 'B', text: 'Membekalkan nutrien khusus mengikut keperluan tanaman' },
        { key: 'C', text: 'Tidak memberi kesan kepada tanaman' },
        { key: 'D', text: 'Mengurangkan hasil' }
      ]
    },
    {
      badge: 'Misi 12',
      title: 'Hasil Ladang',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Situasi',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'warning',
      question: 'Petani menggunakan baja kimia dalam kuantiti yang banyak setiap musim. Selepas beberapa tahun, hasil tanaman semakin merosot. Apakah kemungkinan puncanya?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Kandungan oksigen tanah meningkat' },
        { key: 'B', text: 'Tanah menjadi terlalu berasid' },
        { key: 'C', text: 'Tanah kekurangan cahaya matahari' },
        { key: 'D', text: 'Tanah mengandungi terlalu banyak air' }
      ]
    },
    {
      badge: 'Misi 13',
      title: 'Tanda Pada Daun',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Punca',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'warning',
      question: 'Seorang petani mendapati daun tanaman rosak selepas penggunaan baja kimia yang berlebihan. Apakah puncanya?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Kekurangan air' },
        { key: 'B', text: 'Kesan toksik akibat lebihan nutrien' },
        { key: 'C', text: 'Kekurangan cahaya' },
        { key: 'D', text: 'Serangan haiwan' }
      ]
    },
    {
      badge: 'Misi 14',
      title: 'Cari Punca',
      desc: 'Baca soalan dan pilih jawapan paling tepat.',
      type: 'Soalan Sebab',
      chip: 'Kuiz',
      bag: 'Baja',
      style: 'warning',
      question: 'Bagaimanakah penggunaan baja kimia berlebihan meningkatkan keasidan tanah?',
      answer: 'B',
      options: [
        { key: 'A', text: 'Mengurangkan bahan organik' },
        { key: 'B', text: 'Tindak balas kimia menghasilkan ion berasid' },
        { key: 'C', text: 'Menambah air dalam tanah' },
        { key: 'D', text: 'Mengurangkan suhu tanah' }
      ]
    }
  ];

  const state = {
    index: 0,
    completed: 0,
    score: 0,
    selected: '',
    solved: false
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function currentQuestion() {
    return questions[state.index];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function resetSceneClasses() {
    const scene = $('#jbg-scene');
    scene.classList.remove('jbg-correct', 'jbg-wrong');
    void scene.offsetWidth;
  }

  function updateProgress() {
    const pct = (state.completed / TOTAL_QUESTIONS) * 100;
    $('#jbg-progress-fill').style.width = `${pct}%`;
    setText('#jbg-score-display', state.score);
    setText('#jbg-step-label', `Soalan ${Math.min(state.index + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`);
  }

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function growthBetween(ratio, start, end) {
    if (end <= start) return ratio >= end ? 1 : 0;
    return clamp((ratio - start) / (end - start));
  }

  function updatePlantGrowth() {
    const ratio = state.score / TOTAL_QUESTIONS;
    const seedFade = 1 - growthBetween(ratio, 0.01, 0.08);
    const sproutRise = growthBetween(ratio, 0.04, 0.11);
    const sproutFade = 1 - growthBetween(ratio, 0.16, 0.26);
    const sprout = sproutRise * sproutFade;
    const stem = growthBetween(ratio, 0.08, 0.2);
    const stemDraw = growthBetween(ratio, 0.08, 0.66);
    const lowerLeaves = growthBetween(ratio, 0.18, 0.36);
    const lowerLeafOpacity = lowerLeaves > 0 ? 1 : 0;
    const upperLeaves = growthBetween(ratio, 0.42, 0.63);
    const upperLeafOpacity = upperLeaves > 0 ? 1 : 0;
    const bloom = growthBetween(ratio, 0.72, 0.92);
    const rootGrowth = growthBetween(ratio, 0.04, 0.34);
    const scene = $('#jbg-scene');

    scene.style.setProperty('--jbg-growth', ratio.toFixed(2));
    scene.style.setProperty('--jbg-growth-percent', `${Math.round(ratio * 100)}%`);
    scene.style.setProperty('--jbg-plant-scale', (0.72 + ratio * 0.28).toFixed(2));
    scene.style.setProperty('--jbg-seed-opacity', seedFade.toFixed(2));
    scene.style.setProperty('--jbg-seed-scale', (0.82 + seedFade * 0.18).toFixed(2));
    scene.style.setProperty('--jbg-sprout-opacity', sprout.toFixed(2));
    scene.style.setProperty('--jbg-sprout-scale', (0.48 + sproutRise * 0.52).toFixed(2));
    scene.style.setProperty('--jbg-stem-opacity', stem.toFixed(2));
    scene.style.setProperty('--jbg-stem-offset', Math.round(176 * (1 - stemDraw)));
    scene.style.setProperty('--jbg-low-leaf-opacity', lowerLeafOpacity.toFixed(2));
    scene.style.setProperty('--jbg-low-leaf-scale', (0.58 + lowerLeaves * 0.42).toFixed(2));
    scene.style.setProperty('--jbg-top-leaf-opacity', upperLeafOpacity.toFixed(2));
    scene.style.setProperty('--jbg-top-leaf-scale', (0.52 + upperLeaves * 0.48).toFixed(2));
    scene.style.setProperty('--jbg-bloom-opacity', bloom.toFixed(2));
    scene.style.setProperty('--jbg-sun-opacity', (0.25 + ratio * 0.65).toFixed(2));
    scene.style.setProperty('--jbg-field-opacity', (0.1 + ratio * 0.82).toFixed(2));
    scene.style.setProperty('--jbg-root-opacity', (rootGrowth * 0.9).toFixed(2));
    scene.style.setProperty('--jbg-root-main', `${Math.round(14 + rootGrowth * 54)}px`);
    scene.style.setProperty('--jbg-root-side', `${Math.round(10 + rootGrowth * 41)}px`);
    setText('#jbg-growth-text', `${Math.round(ratio * 100)}%`);
  }

  function setFeedback(message, positive = false) {
    const feedback = $('#jbg-feedback');
    feedback.textContent = message;
    feedback.classList.toggle('jbg-good', positive);
  }

  function renderOptions(question) {
    $('#jbg-option-grid').innerHTML = question.options.map((option) => (
      `<button class="jbg-option-btn" type="button" data-jbg-key="${escapeHtml(option.key)}">${escapeHtml(option.text)}</button>`
    )).join('');
  }

  function renderQuestion() {
    const question = currentQuestion();
    state.selected = '';
    state.solved = false;

    resetSceneClasses();
    $('#jbg-nutrient-dust').innerHTML = '';

    setText('#jbg-mission-badge', question.badge);
    setText('#jbg-mission-title', question.title);
    setText('#jbg-mission-desc', question.desc);
    setText('#jbg-question-type', question.type);
    setText('#jbg-topic-chip', question.chip);
    setText('#jbg-bag-label', question.bag);
    setText('#jbg-question-count', `${state.index + 1}/${TOTAL_QUESTIONS}`);
    setText('#jbg-question-text', question.question);
    setFeedback('');

    renderOptions(question);
    $('#jbg-submit-btn').disabled = false;
    $('#jbg-submit-btn').textContent = 'Semak Jawapan';
    updateProgress();
    updatePlantGrowth();
  }

  function createParticles(style) {
    const dust = $('#jbg-nutrient-dust');
    const palettes = {
      organic: ['#7cb342', '#a5d6a7', '#8d6e63', '#f6e4a5'],
      chemical: ['#66bb6a', '#ffb74d', '#4fc3f7', '#f6e4a5'],
      mixed: ['#66bb6a', '#ffb74d', '#8bc34a', '#f6e4a5'],
      warning: ['#ffb74d', '#f6e4a5', '#8bc34a', '#66bb6a']
    };
    const colors = palettes[style] || palettes.mixed;

    dust.innerHTML = '';

    for (let i = 0; i < 26; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'jbg-particle';
      particle.style.setProperty('--jbg-x', `${26 + Math.random() * 54}%`);
      particle.style.setProperty('--jbg-size', `${4 + Math.random() * 5}px`);
      particle.style.setProperty('--jbg-drift', `${-18 + Math.random() * 36}px`);
      particle.style.setProperty('--jbg-color', colors[i % colors.length]);
      particle.style.animationDelay = `${Math.random() * 0.18}s`;
      dust.appendChild(particle);
    }

    window.setTimeout(() => {
      dust.innerHTML = '';
    }, 1150);
  }

  function triggerCorrectAnimation(style) {
    resetSceneClasses();
    $('#jbg-scene').classList.add('jbg-correct');
    createParticles(style);
  }

  function triggerWrongAnimation() {
    resetSceneClasses();
    $('#jbg-scene').classList.add('jbg-wrong');
  }

  function completeQuestion(correct) {
    const question = currentQuestion();

    if (correct) {
      state.score += 1;
    }

    state.completed += 1;
    state.solved = true;
    updateProgress();
    updatePlantGrowth();

    $$('.jbg-option-btn').forEach((button) => {
      const isAnswer = button.dataset.jbgKey === question.answer;
      const isSelected = button.dataset.jbgKey === state.selected;
      button.disabled = true;
      button.classList.toggle('jbg-correct', isAnswer);
      button.classList.toggle('jbg-wrong', isSelected && !correct);
    });

    if (correct) {
      triggerCorrectAnimation(question.style);
      setFeedback('Betul. Baja ditabur dan pokok membesar.', true);
    } else {
      triggerWrongAnimation();
      const answer = question.options.find((option) => option.key === question.answer);
      setFeedback(`Salah. Jawapan betul: ${question.answer}. ${answer.text}.`);
    }

    if (state.index === TOTAL_QUESTIONS - 1) {
      $('#jbg-submit-btn').disabled = true;
      $('#jbg-submit-btn').textContent = 'Game Selesai';
      window.setTimeout(finishGame, correct ? 1250 : 850);
      return;
    }

    $('#jbg-submit-btn').textContent = 'Soalan Seterusnya';
  }

  function evaluateAnswer() {
    if (!state.selected) {
      setFeedback('Pilih satu jawapan dahulu.');
      return;
    }

    completeQuestion(state.selected === currentQuestion().answer);
  }

  function handleSubmit() {
    if (state.solved) {
      state.index += 1;
      renderQuestion();
      return;
    }

    evaluateAnswer();
  }

  function finishGame() {
    const finalScore = `${state.score}/${TOTAL_QUESTIONS}`;
    setText('#jbg-final-score', finalScore);
    localStorage.setItem('jenisBajaCompleted', 'true');
    localStorage.setItem('jenisBajaScore', String(state.score));
    $('#jbg-completion-modal').classList.remove('jbg-hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();

    $('#jbg-option-grid').addEventListener('click', (event) => {
      const button = event.target.closest('.jbg-option-btn');
      if (!button || state.solved) return;

      state.selected = button.dataset.jbgKey;
      $$('.jbg-option-btn').forEach((item) => item.classList.remove('jbg-selected', 'jbg-wrong'));
      button.classList.add('jbg-selected');
      setFeedback('');
    });

    $('#jbg-submit-btn').addEventListener('click', handleSubmit);
  });
})();
