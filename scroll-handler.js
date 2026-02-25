/**
 * Swipe up / scroll up on landing transitions to main hero view.
 */
(function () {
  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  if (!app || !landing) return;

  const THRESHOLD = 40;
  let accumulated = 0;

  function goToMain() {
    app.classList.add('past-landing');
    landing.style.pointerEvents = 'none';
  }

  function onWheel(e) {
    if (app.classList.contains('past-landing')) return;
    if (e.deltaY >= 0) {
      accumulated = 0;
      return;
    }
    accumulated += Math.abs(e.deltaY);
    if (accumulated >= THRESHOLD) {
      accumulated = 0;
      goToMain();
    }
  }

  let touchStartY = 0;
  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    if (app.classList.contains('past-landing')) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (delta > THRESHOLD) goToMain();
  }

  app.addEventListener('wheel', onWheel, { passive: true });
  landing.addEventListener('touchstart', onTouchStart, { passive: true });
  landing.addEventListener('touchend', onTouchEnd, { passive: true });
})();
