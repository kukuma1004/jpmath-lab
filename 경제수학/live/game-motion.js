(function () {
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;

  function announceRound(round, gameTitle, type) {
    if (reduced()) return;
    document.querySelector('[data-round-announcement]')?.remove();
    const layer = document.createElement('div');
    layer.className = 'round-announcement';
    layer.dataset.roundAnnouncement = '';
    layer.innerHTML = `<div><span>${type || 'MARKET OPEN'}</span><strong>ROUND ${String(round + 1).padStart(2, '0')}</strong><b>${gameTitle}</b></div>`;
    document.body.append(layer);
    requestAnimationFrame(() => layer.classList.add('show'));
    clearTimeout(timer);
    timer = setTimeout(() => { layer.classList.remove('show'); setTimeout(() => layer.remove(), 360); }, 1050);
  }

  function enter(element, className) {
    if (!element || reduced()) return;
    const name = className || 'motion-enter';
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
  }

  function count(element, target, formatter, duration) {
    if (!element) return;
    if (reduced()) { element.textContent = formatter(target); return; }
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const progress = Math.min(1, (now - start) / (duration || 650));
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = formatter(from + (target - from) * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.JPEconomyMotion = { announceRound, enter, count };
}());
