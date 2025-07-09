// tooltip.js

export let tooltipWrapper;
export let hoverToType;

export function setupTooltip() {

  hoverToType = document.querySelector('#hoverToTypePomo');
  tooltipWrapper = document.querySelector('#tooltipWrapper');

  tooltipWrapper.onclick = function () {
    // Alterna entre mostrar e esconder o tooltip
    if (hoverToType.style.display === 'inline') {
      hoverToType.style.display = 'none';
    } else {
      hoverToType.style.display = 'inline';
    }
  };

  // Oculta tooltip se clicar fora
  document.addEventListener('click', function (event) {
    if (
      !tooltipWrapper.contains(event.target) &&
      !hoverToType.contains(event.target)
    ) {
      hoverToType.style.display = 'none';
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setupTooltip();
});
