(function () {
  'use strict';

  const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
  const audioFiles = {
    theme: 'theme-song.mpeg',
    correct: 'right-answer.mpeg',
    wrong: 'wrong-answer.mpeg'
  };
  const themeOwnerKey = 'agrirevise-theme-owner';
  const themeChannelName = 'agrirevise-theme-audio';

  const sharedAudioState = window.__AgriReviseAudioState || {
    audioCache: {},
    themeStarted: false,
    themeStarting: false,
    listenersBound: false,
    boundStartTheme: null,
    themeCrossTabBound: false,
    themeChannel: null,
    themeTabId: null
  };
  window.__AgriReviseAudioState = sharedAudioState;

  if (!sharedAudioState.themeTabId) {
    sharedAudioState.themeTabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function getThemeAudioElement() {
    return sharedAudioState.audioCache.theme || document.getElementById('ar-theme-audio');
  }

  function bindThemeStartListeners() {
    if (sharedAudioState.listenersBound) return;

    sharedAudioState.boundStartTheme = sharedAudioState.boundStartTheme || (() => startTheme());
    document.addEventListener('pointerdown', sharedAudioState.boundStartTheme);
    document.addEventListener('keydown', sharedAudioState.boundStartTheme);
    sharedAudioState.listenersBound = true;
  }

  function unbindThemeStartListeners() {
    if (!sharedAudioState.boundStartTheme || !sharedAudioState.listenersBound) return;

    document.removeEventListener('pointerdown', sharedAudioState.boundStartTheme);
    document.removeEventListener('keydown', sharedAudioState.boundStartTheme);
    sharedAudioState.listenersBound = false;
  }

  function readThemeOwner() {
    try {
      return JSON.parse(window.localStorage.getItem(themeOwnerKey) || '{}');
    } catch (error) {
      return {};
    }
  }

  function isCurrentThemeOwner() {
    const owner = readThemeOwner();
    return !owner.id || owner.id === sharedAudioState.themeTabId;
  }

  function pauseThemeForExternalClaim() {
    const audio = getThemeAudioElement();

    if (audio) {
      audio.pause();
    }

    sharedAudioState.themeStarted = false;
    sharedAudioState.themeStarting = false;
    bindThemeStartListeners();
  }

  function claimThemeOwner() {
    const claim = {
      type: 'theme-owner',
      id: sharedAudioState.themeTabId,
      at: Date.now()
    };

    try {
      window.localStorage.setItem(themeOwnerKey, JSON.stringify(claim));
    } catch (error) {
      // localStorage may be unavailable in some browser privacy modes.
    }

    if (sharedAudioState.themeChannel) {
      try {
        sharedAudioState.themeChannel.postMessage(claim);
      } catch (error) {
        // BroadcastChannel can fail in restricted browsing contexts.
      }
    }
  }

  function releaseThemeOwner() {
    const owner = readThemeOwner();

    if (owner.id !== sharedAudioState.themeTabId) return;

    try {
      window.localStorage.removeItem(themeOwnerKey);
    } catch (error) {
      // Nothing else to clean up if localStorage is unavailable.
    }
  }

  function setupCrossTabAudioGuard() {
    if (sharedAudioState.themeCrossTabBound) return;

    sharedAudioState.themeCrossTabBound = true;

    if ('BroadcastChannel' in window) {
      try {
        sharedAudioState.themeChannel = new window.BroadcastChannel(themeChannelName);
        sharedAudioState.themeChannel.onmessage = (event) => {
          const data = event.data || {};
          if (data.type === 'theme-owner' && data.id !== sharedAudioState.themeTabId) {
            pauseThemeForExternalClaim();
          }
        };
      } catch (error) {
        sharedAudioState.themeChannel = null;
      }
    }

    window.addEventListener('storage', (event) => {
      if (event.key !== themeOwnerKey || !event.newValue) return;

      try {
        const data = JSON.parse(event.newValue);
        if (data.id !== sharedAudioState.themeTabId) {
          pauseThemeForExternalClaim();
        }
      } catch (error) {
        // Ignore malformed storage payloads from other contexts.
      }
    });

    window.addEventListener('pagehide', releaseThemeOwner);
  }

  function getAudio(name) {
    if (!audioFiles[name]) return null;

    if (name === 'theme') {
      const src = new URL(`audio/${audioFiles[name]}`, scriptUrl).toString();
      let audio = document.getElementById('ar-theme-audio');

      document.querySelectorAll('audio[data-ar-theme-song="true"]').forEach((item) => {
        if (item !== audio) {
          item.pause();
          item.remove();
        }
      });

      if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'ar-theme-audio';
        audio.dataset.arThemeSong = 'true';
        audio.preload = 'auto';
        audio.loop = true;
        document.body.appendChild(audio);
      }

      if (audio.src !== src) {
        audio.src = src;
      }

      audio.volume = 0.12;

      if (sharedAudioState.audioCache.theme && sharedAudioState.audioCache.theme !== audio) {
        sharedAudioState.audioCache.theme.pause();
      }

      sharedAudioState.audioCache.theme = audio;
      return audio;
    }

    if (!sharedAudioState.audioCache[name]) {
      const audio = new Audio(new URL(`audio/${audioFiles[name]}`, scriptUrl).toString());
      audio.preload = 'auto';
      audio.volume = name === 'theme' ? 0.16 : 0.55;
      sharedAudioState.audioCache[name] = audio;
    }

    return sharedAudioState.audioCache[name];
  }

  function startTheme() {
    const audio = getAudio('theme');
    if (!audio) return;
    if (sharedAudioState.themeStarted || sharedAudioState.themeStarting || !audio.paused) return;

    claimThemeOwner();
    sharedAudioState.themeStarting = true;
    audio.loop = true;
    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          if (!isCurrentThemeOwner()) {
            pauseThemeForExternalClaim();
            return;
          }

          sharedAudioState.themeStarted = true;
          sharedAudioState.themeStarting = false;
          unbindThemeStartListeners();
        })
        .catch(() => {
          if (isCurrentThemeOwner()) {
            releaseThemeOwner();
          }

          sharedAudioState.themeStarted = false;
          sharedAudioState.themeStarting = false;
        });
      return;
    }

    sharedAudioState.themeStarted = true;
    sharedAudioState.themeStarting = false;
    unbindThemeStartListeners();
  }

  function playSound(name) {
    const audio = getAudio(name);
    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      // Some browsers can reject currentTime before the media is ready.
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  function injectStyles() {
    if (document.getElementById('ar-game-utils-style')) return;

    const style = document.createElement('style');
    style.id = 'ar-game-utils-style';
    style.textContent = `
      .ar-lives-pill {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 28px;
        padding: 5px 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.9);
        color: #8a1d1d;
        border: 1.5px solid rgba(210,70,70,0.28);
        box-shadow: 0 2px 10px rgba(180,40,40,0.14);
        font-family: 'Nunito', sans-serif;
        font-size: 0.62rem;
        font-weight: 900;
        white-space: nowrap;
      }

      .ar-lives-label {
        color: #5c1f1f;
      }

      .ar-life-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ef5350, #c62828);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45);
      }

      .ar-life-dot.is-empty {
        background: rgba(120,80,80,0.18);
        box-shadow: inset 0 0 0 1px rgba(120,80,80,0.18);
      }

      .ar-game-over-modal {
        position: fixed;
        inset: 0;
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 22px;
        background: rgba(20,35,20,0.58);
        backdrop-filter: blur(10px);
      }

      .ar-game-over-modal.hidden {
        display: none;
      }

      .ar-game-over-card {
        width: min(320px, 100%);
        border-radius: 18px;
        padding: 22px 18px;
        text-align: center;
        background: rgba(255,255,255,0.94);
        border: 1.5px solid rgba(46,125,50,0.24);
        box-shadow: 0 22px 60px rgba(0,0,0,0.22);
        font-family: 'Nunito', sans-serif;
      }

      .ar-game-over-card h2 {
        margin: 0 0 8px;
        color: #1b5e2f;
        font-family: 'Fredoka One', cursive;
        font-size: 1.35rem;
      }

      .ar-game-over-card p {
        margin: 0 0 16px;
        color: #4a6a4a;
        font-size: 0.86rem;
        font-weight: 800;
        line-height: 1.35;
      }

      .ar-game-over-card button {
        border: none;
        border-radius: 999px;
        padding: 10px 18px;
        background: linear-gradient(135deg, #2e7d32, #43a047);
        color: #fff;
        font-family: 'Fredoka One', cursive;
        font-size: 0.78rem;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(46,125,50,0.28);
      }

      @media (max-width: 390px) {
        .ar-lives-pill {
          padding: 5px 7px;
          gap: 3px;
          font-size: 0.55rem;
        }

        .ar-life-dot {
          width: 6px;
          height: 6px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createGameOverModal(onRestart) {
    let modal = document.getElementById('ar-game-over-modal');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ar-game-over-modal';
      modal.className = 'ar-game-over-modal hidden';
      modal.innerHTML = `
        <div class="ar-game-over-card" role="dialog" aria-modal="true" aria-labelledby="ar-game-over-title">
          <h2 id="ar-game-over-title">Nyawa Habis</h2>
          <p>Cuba lagi dari mula untuk latihan ini.</p>
          <button type="button" id="ar-game-over-restart">Cuba Lagi</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const restart = modal.querySelector('#ar-game-over-restart');
    restart.onclick = () => {
      if (typeof onRestart === 'function') {
        onRestart();
      } else {
        window.location.reload();
      }
    };

    return modal;
  }

  function findLivesAnchor(selector) {
    if (selector) return document.querySelector(selector);

    return document.querySelector(
      '.game-score-pill, .st-score-pill, .pht-score-pill, .kmt-score-pill, .jbg-score-pill, .jb-score-pill'
    );
  }

  function initLives(options = {}) {
    injectStyles();

    const max = Number(options.max || 5);
    let current = max;
    let ended = false;
    const pill = document.createElement('div');
    pill.className = 'ar-lives-pill';
    pill.setAttribute('aria-live', 'polite');

    function render() {
      const dots = Array.from({ length: max }, (_, index) => (
        `<span class="ar-life-dot${index >= current ? ' is-empty' : ''}" aria-hidden="true"></span>`
      )).join('');

      pill.innerHTML = `<span class="ar-lives-label">Nyawa</span>${dots}<span>${current}/${max}</span>`;
      pill.setAttribute('aria-label', `Nyawa ${current} daripada ${max}`);
    }

    function place() {
      const anchor = findLivesAnchor(options.anchorSelector);

      if (anchor && anchor.parentElement) {
        anchor.insertAdjacentElement('afterend', pill);
        return;
      }

      document.body.appendChild(pill);
    }

    function showGameOver() {
      const modal = createGameOverModal(options.onRestart);
      modal.classList.remove('hidden');
    }

    render();
    place();

    return {
      get() {
        return current;
      },
      isEmpty() {
        return current <= 0;
      },
      lose(count = 1) {
        if (ended) return current;

        current = Math.max(0, current - Math.max(1, Number(count) || 1));
        render();

        if (current <= 0) {
          ended = true;
          if (typeof options.onEmpty === 'function') {
            options.onEmpty();
          }
          showGameOver();
        }

        return current;
      },
      reset() {
        ended = false;
        current = max;
        render();
      },
      disable() {
        ended = true;
      }
    };
  }

  setupCrossTabAudioGuard();
  bindThemeStartListeners();

  window.AgriReviseGame = {
    initLives,
    playSound,
    startTheme
  };
})();
