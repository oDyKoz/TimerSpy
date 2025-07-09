// Pomodoro.js

export let activate;
export let disable;

export function setupPomodoro() {

  activate = document.querySelector('#activatePomo');
  disable = document.querySelector('#disablePomo');

  activate.onclick = function () {
    if (activate.style.backgroundColor = '#81818180') {
        disable.style.backgroundColor = '#81818180';
    } else {
        activate.style.backgroundColor = '#81818180'
    }
    
  };

}

document.addEventListener("DOMContentLoaded", function() {
  setupTooltip();
});
