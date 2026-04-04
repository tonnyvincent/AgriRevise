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
