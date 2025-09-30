export let ColorModal;
export let ColorAll;
export let bgAll;
export let body;
export let botaoLight;
export let botaoDark;

// Definição de cores
const colors = {
  dark: {
    background: '#252525',
    text: '#fff',
    modalBackground: '#333',
    modalText: '#fff',
    cardBackground: '#252525'
  },
  light: {
    background: '#ffffffff',
    text: '#000',
    modalBackground: '#fff',
    modalText: '#000',
    cardBackground: '#ffffffff'
  }
};

// Função genérica para aplicar o tema
function applyTheme(theme) {
  // Background do body
  body.style.background = theme.background;

  // Texto geral
  ColorAll.forEach(element => {
    element.style.color = theme.text;
  });

  // Modal e cards
  ColorModal.forEach(element => {
    element.style.background = theme.modalBackground;
    element.style.color = theme.modalText;
  });

  // Se quiser aplicar em bgAll também:
  bgAll.forEach(element => {
    element.style.background = theme.cardBackground;
  });
}

export function DarkModeConfig() {
  // Seleciona elementos
  body = document.body;
  bgAll = document.querySelectorAll('.bg-all');
  ColorAll = document.querySelectorAll('#ColorAll, .C-ColorAll');
  ColorModal = document.querySelectorAll('.modalUp-content, .modal-content, .Card');

  botaoLight = document.querySelector('.btn-toggle-light');
  botaoDark = document.querySelector('.btn-toggle-dark');

  // Animações iniciais
  botaoLight.classList.add('slide-animation-right');
  botaoDark.classList.add('slide-animation-left');

  // Eventos dos botões
  botaoLight.onclick = function() {
    botaoLight.style.display = "none";
    botaoDark.style.display = "inline";
    applyTheme(colors.dark);
  };

  botaoDark.onclick = function() {
    botaoDark.style.display = "none";
    botaoLight.style.display = "inline";
    applyTheme(colors.light);
  };
}

// Inicia configuração ao carregar a página
document.addEventListener("DOMContentLoaded", DarkModeConfig);
