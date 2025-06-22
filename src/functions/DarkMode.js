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
export let bgIcons;
export let body;
export let botaoLight;
export let botaoDark;

export function DarkModeConfig() {
  // Pega os elementos HTML
  body = document.body;
  bgIcons = document.querySelector('bg-icons')
  letters = document.querySelector('h1','h2','h3','h4','p','span','i')
  ModalStyle = document.querySelector('modalUp')
  
  // Pega os botões
  botaoLight = document.querySelector('.btn-toggle-light');
  botaoDark = document.querySelector('.btn-toggle-dark');

  // Botão dark clicado
  botaoLight.onclick = function ModoDark() {
    botaoLight.style.display = "none";
    botaoDark.style.display = "inline";
    
    // Aplica tema dark
    body.setAttribute('style', 'background:#252525;');
    bgIcons.setAttribute('style','background:#252525;');
    letters.setAttribute('style','background:#fff;');
  }

  // Botão light clicado
  botaoDark.onclick = function() {
    botaoDark.style.display = "none";
    botaoLight.style.display = "inline";
    
    // Aplica tema light
    body.setAttribute('style', 'background:#fefdfb;');
  }
}

document.addEventListener("DOMContentLoaded", function() {

    botaoLight = document.querySelector("btn-toggle-light");
  
    botaoDark = document.querySelector("btn-toggle-dark");

 

  
    DarkModeConfig();
});
