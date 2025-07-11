export let activate;
export let disable;

export function setupPomodoro() {
  activate = document.getElementById('activatePomo');
  disable = document.getElementById('disablePomo');

  disable.onclick = function() {
    activate.style.backgroundColor = '#e0e0e08e';
    disable.style.backgroundColor = '#81818180'; 
  }

  activate.onclick = function() {
    activate.style.backgroundColor = '#81818180';
    disable.style.backgroundColor = '#e0e0e08e'; 
  }

  
};

document.addEventListener("DOMContentLoaded", function() {
  setupPomodoro(); // Estava chamando setupTooltip() em vez de setupPomodoro()
});
