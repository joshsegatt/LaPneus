/**
 * L.A Pneus - Porsche Horizon Infinite Showcase Controller
 * Understated Luxury & High-Precision Motion Standard
 * Pure Vanilla JS, Zero Inline Styles, 120fps Smooth Infinite Glide
 */

(function () {
  'use strict';

  function initPorscheMarquee() {
    const wrapper = document.getElementById('porscheMarquee');
    const track = document.getElementById('porscheTrack');
    if (!wrapper || !track) return;

    const btnToggle = document.querySelector('.porsche-nav-toggle');
    const btnPrev = document.querySelector('.porsche-nav-prev');
    const btnNext = document.querySelector('.porsche-nav-next');

    // Toggle Pause / Play
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        wrapper.classList.toggle('is-paused');
      });
    }

    // Interactive Nudge on Arrow Buttons
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        wrapper.classList.remove('is-paused');
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        wrapper.classList.remove('is-paused');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPorscheMarquee);
  } else {
    initPorscheMarquee();
  }
})();
