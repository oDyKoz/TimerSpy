export let ColorModal;
export let ColorAll;
export let bgAll;
export let body;
export let botaoLight;
export let botaoDark;

// Definindo cores
const colors = {
  dark: {
    background: '#252525',
    text: '#fff',
    modalBackground: '#333', // Cor de fundo do modal no modo escuro
    modalText: '#fff', // Cor do texto do modal no modo escuro
    cardBackground: '#363636', 
  },
  light: {
    background: '#fefdfb',
    text: '#000',
    modalBackground: '#fff', // Cor de fundo do modal no modo claro
    modalText: '#000', // Cor do texto do modal no modo claro
    cardBackground: '#eeeeee',
  }
};

export function DarkModeConfig() {
  // Pega os elementos HTML
  body = document.body;
  bgAll = document.querySelectorAll('.bg-all');
  ColorAll = document.querySelectorAll('#ColorAll, .C-ColorAll');
  ColorModal = document.querySelectorAll('.modalUp-content, .modal-content, .Card');

  // Pega os botões
  botaoLight = document.querySelector('.btn-toggle-light');
  botaoDark = document.querySelector('.btn-toggle-dark');

  botaoLight.classList.add('slide-animation-right');
  botaoDark.classList.add('slide-animation-left');

  // Função para aplicar estilos de texto
  function applyTextStyles(color) {
    ColorAll.forEach(element => {
      element.style.color = color;
    });
  }

  // Função para aplicar estilos ao modal
  function applyModalStyles(backgroundColor, textColor) {
    ColorModal.style.background = backgroundColor;
    ColorModal.style.color = textColor;
  }

  // Botão dark clicado
  botaoLight.onclick = function() {
    botaoLight.style.display = "none";
    botaoDark.style.display = "inline";

    // Aplica background dark
    body.style.background = colors.dark.background;

    // Aplica estilo para todos os elementos de texto
    applyTextStyles(colors.dark.text);

    // Aplica estilo ao modal
    applyModalStyles(colors.dark.modalBackground, colors.dark.modalText);
  }

  // Botão light clicado
  botaoDark.onclick = function() {
    botaoDark.style.display = "none";
    botaoLight.style.display = "inline";

    // Aplica tema light
    body.style.background = colors.light.background;

    // Volta cor original do texto
    applyTextStyles(colors.light.text);

    // Aplica estilo ao modal
    applyModalStyles(colors.light.modalBackground, colors.light.modalText);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  DarkModeConfig();
});
