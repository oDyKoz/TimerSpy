// tooltip.js

export let tooltipWrapper;
export let hoverToType;
let isTooltipOpen = false;
const attachedScrolls = [];

function isVisible(el) {
  if (!el) return false;
  const cs = window.getComputedStyle(el);
  return cs.display !== 'none' && cs.visibility !== 'hidden' && el.hidden !== true && cs.opacity !== '0';
}

function hideTooltip() {
  if (!hoverToType) return;
  hoverToType.style.display = 'none';
  hoverToType.hidden = true;
  isTooltipOpen = false;
}

function showTooltip() {
  if (!hoverToType) return;
  // remove o hidden e deixa o CSS decidir o display (ou você pode forçar 'inline-block' se quiser)
  hoverToType.hidden = false;
  hoverToType.style.display = '';
  isTooltipOpen = true;
}

function toggleTooltip() {
  if (isVisible(hoverToType)) {
    hideTooltip();
  } else {
    showTooltip();
  }
}

function onScrollHandler() {
  // apenas esconde se estiver aberto
  if (isTooltipOpen) {
    // console.log('scroll detectado -> escondendo tooltip');
    hideTooltip();
  }
}

function addScrollListenersToAncestors(el, handler) {
  // adiciona handler a ancestors roláveis e a documentElement
  let p = el ? el.parentElement : null;
  while (p) {
    const style = window.getComputedStyle(p);
    const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;
    if (/auto|scroll|overlay/.test(overflow)) {
      p.addEventListener('scroll', handler, { passive: true });
      attachedScrolls.push({ el: p, handler });
    }
    p = p.parentElement;
  }
  // também escuta documentElement e window
  document.documentElement.addEventListener('scroll', handler, { passive: true });
  attachedScrolls.push({ el: document.documentElement, handler });
  window.addEventListener('scroll', handler, { passive: true });
  attachedScrolls.push({ el: window, handler });
}

export function setupTooltip() {
  hoverToType = document.querySelector('#hoverToTypePomo');
  tooltipWrapper = document.querySelector('#tooltipWrapper');

  if (!hoverToType || !tooltipWrapper) {
    console.warn('tooltip: elementos não encontrados', { hoverToType, tooltipWrapper });
    return;
  }

  // Previna múltiplas bindagens caso setupTooltip seja chamado mais de uma vez
  // (remove listeners previamente adicionados)
  attachedScrolls.forEach(item => {
    try { item.el.removeEventListener('scroll', item.handler); } catch(e) {}
    try { item.el.removeEventListener('scroll', item.handler, { passive: true }); } catch(e) {}
  });
  attachedScrolls.length = 0;

  tooltipWrapper.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleTooltip();
  });

  // fecha ao clicar fora
  document.addEventListener('click', function (event) {
    if (!tooltipWrapper.contains(event.target) && !hoverToType.contains(event.target)) {
      hideTooltip();
    }
  });

  // adiciona listeners de scroll em ancestors roláveis + document + window
  addScrollListenersToAncestors(tooltipWrapper, onScrollHandler);
}
  
document.addEventListener('DOMContentLoaded', function () {
  setupTooltip();
});
