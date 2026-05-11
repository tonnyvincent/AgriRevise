// No scroll behaviour needed — single viewport page.

// Subtle hover lift on cards (CSS handles most of it,
// this adds a quick entrance animation on load)
document.querySelectorAll('.feat-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity 0.45s ${0.15 + i * 0.1}s ease, transform 0.45s ${0.15 + i * 0.1}s ease`;

  // Trigger after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });
});

// Hero text entrance
const heroEls = document.querySelectorAll('.hero-welcome, .hero-title, .hero-subtitle, .hero-btn');
heroEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});

// Nav toggle
const navToggle = document.getElementById('nav-toggle');
const navDropdown = document.getElementById('nav-dropdown');

navToggle.addEventListener('click', () => {
  const isVisible = navDropdown.style.display === 'block';
  navDropdown.style.display = isVisible ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navDropdown.contains(e.target)) {
    navDropdown.style.display = 'none';
  }
});

// ======================================
// LOCK / UNLOCK SECOND GAME
// ======================================

document.addEventListener('DOMContentLoaded', () => {

  setupLockedCard({
    cardId: 'tapak-card',
    overlayId: 'lock-overlay',
    storageKey: 'jenisTanahCompleted',
    message: 'Selesaikan permainan "Jenis dan Sifat Tanah" terlebih dahulu.'
  });

  setupLockedCard({
    cardId: 'pemuliharaan-topic-card',
    overlayId: 'pemuliharaan-topic-lock-overlay',
    storageKey: 'tapakPenanamanCompleted',
    message: 'Selesaikan topik "1.1 Jenis Tanah" terlebih dahulu.'
  });

  setupLockedCard({
    cardId: 'ph-card',
    overlayId: 'ph-lock-overlay',
    storageKey: 'strukturTanahCompleted',
    message: 'Selesaikan permainan "Struktur Tanah" terlebih dahulu.'
  });

  setupLockedCard({
    cardId: 'kaedah-card',
    overlayId: 'kaedah-lock-overlay',
    storageKey: 'phTanahCompleted',
    message: 'Selesaikan permainan "PH Tanah" terlebih dahulu.'
  });

  setupLockedCard({
    cardId: 'baja-topic-card',
    overlayId: 'baja-topic-lock-overlay',
    storageKey: 'kaedahMemperbaikiTanahCompleted',
    message: 'Selesaikan topik "1.2 Pemuliharaan Tanah" terlebih dahulu.'
  });

  setupCardNavigation();

});

function setupCardNavigation() {
  document.querySelectorAll('a.lp-card[href]').forEach((card) => {
    card.addEventListener('click', (e) => {
      const href = card.getAttribute('href');

      if (!href || href === '#' || card.classList.contains('locked') || e.defaultPrevented) {
        return;
      }

      e.preventDefault();
      window.location.href = href;
    });
  });
}

function setupLockedCard({ cardId, overlayId, storageKey, message }) {
  const card = document.getElementById(cardId);
  const overlay = document.getElementById(overlayId);

  if (!card) return;

  const gameUnlocked = localStorage.getItem(storageKey);

  if (gameUnlocked !== 'true') {
    card.classList.add('locked');

    card.addEventListener('click', (e) => {
      e.preventDefault();
      alert(message);
    });

    return;
  }

  card.classList.remove('locked');

  if (overlay) {
    overlay.style.display = 'none';
  }
}

// ======================================
// PLAYER NAME MODAL
// ======================================

document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('name-modal');
  const input = document.getElementById('player-name-input');
  const saveBtn = document.getElementById('save-player-name');

  if (!modal) return;

  // check existing player
  const existingName = localStorage.getItem('playerName');

  // already exists
  if (existingName) {
    modal.classList.add('hidden');
    return;
  }

  // first time user
  modal.classList.remove('hidden');

  // auto focus
  setTimeout(() => {
    input.focus();
  }, 200);

  function savePlayerName() {

    const playerName = input.value.trim();

    if (playerName.length < 2) {
      alert('Sila masukkan nama yang sah.');
      return;
    }

    // SAVE LOCALLY
    localStorage.setItem('playerName', playerName);

    console.log("PLAYER NAME SAVED:", playerName);

    // later you can send to DB here

    modal.classList.add('hidden');
  }

  saveBtn.addEventListener('click', savePlayerName);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      savePlayerName();
    }
  });

});
