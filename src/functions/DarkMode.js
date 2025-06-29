// export function DarkMode() {
//   const root = document.documentElement;
//   const botao = document.querySelector('.bg-toggle-light');

//   if (!botao) return;

//   const temaSalvo = localStorage.getItem('tema') || 'light';
//   root.setAttribute('data-theme', temaSalvo);

//   botao.addEventListener('click', () => {
//     const temaAtual = root.getAttribute('data-theme');
//     const novoTema = temaAtual === 'light' ? 'dark' : 'light';
//     root.setAttribute('data-theme', novoTema);
//     localStorage.setItem('tema', novoTema);
//   });
// }


// export let body;

// export let botaoLight;
// export let botaoDark;

// export function DarkModeConfig() {

//   botaoLight.onclick = function() {
//     botaoLight.style.display = "none";
//     botaoDark.style.display = "inline";
//   }

//   botaoDark.onclick = function() {
//     botaoDark.style.display = "none";
//     botaoLight.style.display = "inline";
//   }

// }

// export function DarkModeStyle() {
  
// }

export let ModalStyle;
export let letters;
export let bgAll;
export let body;
export let botaoLight;
export let botaoDark;

export function DarkModeConfig() {
  // Pega os elementos HTML
  body = document.body;
  bgAll = document.querySelector('.bg-all'); // Adicionado ponto para classe
  letters = document.querySelectorAll('h1, h2, h3, h4, p, span, i'); // Usando querySelectorAll com sintaxe correta
  ModalStyle = document.querySelector('.modalUp'); // Adicionado ponto para classe
  
  // Pega os botões (corrigindo os seletores)
  botaoLight = document.querySelector('.btn-toggle-light');
  botaoDark = document.querySelector('.btn-toggle-dark');

  // Botão dark clicado
  botaoLight.onclick = function ModoDark() {
    botaoLight.style.display = "none";
    botaoDark.style.display = "inline";
    
    // Aplica background dark
    body.style.background = '#252525';
    if (bgAll) bgAll.style.backgroundColor = '#252525';



    
    // Aplica estilo para todos os elementos de texto
    letters.forEach(element => {
      element.style.color = '#fff'; // Muda a cor do texto, não o background
    });


  }

  // Botão light clicado
  botaoDark.onclick = function() {
    botaoDark.style.display = "none";
    botaoLight.style.display = "inline";
    
    // Aplica tema light
    body.style.background = '#fefdfb';
    
    // Volta cor original do texto
    letters.forEach(element => {
      element.style.color = ''; // Remove o estilo inline
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
    // Corrigindo seletores (adicionando ponto para classes)
    botaoLight = document.querySelector(".btn-toggle-light");
    botaoDark = document.querySelector(".btn-toggle-dark");
  
    DarkModeConfig();
});
