function applyInfoStyles() {
  ['#heroia-info-popup', '.heroia-info-header', '.heroia-info-line',
   '#info-status', '#info-email', '#info-license', '#info-device',
   '#info-activated', '#info-last', '#info-version']
    .map(sel => document.querySelector(sel))
    .filter(Boolean)
    .forEach(el => {
      el.style.color = '#0b1b2b';
      el.style.opacity = 1;
    });
}

function onReady(fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }
}

onReady(applyInfoStyles);

// Also react when the info popup is inserted/toggled after load
const mo = new MutationObserver(() => applyInfoStyles());
mo.observe(document.documentElement || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
