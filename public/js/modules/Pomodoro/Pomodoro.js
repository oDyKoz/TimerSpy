/**
 * Configura a funcionalidade da sidebar do Pomodoro, com botões para ativar/desativar,
 * alternar visibilidade do conteúdo e fechar o conteúdo ao pressionar "Escape" ou clicar fora.
 */
export function setupPomodoro() {
  const COLORS = {
    ACTIVE: '#81818180',
    INACTIVE: '#e0e0e08e',
  };

  // Captura dos elementos do DOM
  const activate = document.getElementById('activatePomo');
  const disable = document.getElementById('disablePomo');
  const sidebar = document.getElementById('sidebarPomo');
  const btnOpenClose = document.getElementById('btnOpenClose');
  const sidebarPomoContent = document.getElementById('sidebarPomoContent');

  // Verifica se todos os elementos existem
  if (!activate || !disable || !sidebar || !btnOpenClose || !sidebarPomoContent) {
    console.error('Um ou mais elementos do DOM não foram encontrados.');
    return;
  }

  // Define estados iniciais
  sidebar.style.display = 'none'; // Sidebar começa visível
  sidebarPomoContent.style.display = 'none'; // Conteúdo começa escondido
  sidebar.setAttribute('aria-hidden', 'false');
  sidebarPomoContent.setAttribute('aria-hidden', 'true');

  // Garante que sidebarPomoContent seja focável
  if (!sidebarPomoContent.hasAttribute('tabindex')) {
    sidebarPomoContent.setAttribute('tabindex', '0');
  }

  // Adiciona atributos ARIA
  btnOpenClose.setAttribute('aria-label', 'Alternar conteúdo do Pomodoro');
  activate.setAttribute('aria-label', 'Ativar conteúdo do Pomodoro');
  disable.setAttribute('aria-label', 'Desativar sidebar do Pomodoro');

  /**
   * Alterna a visibilidade do sidebarPomoContent, mantendo a sidebar visível.
   */
  function toggleSidebar() {
    const isContentOpen = getComputedStyle(sidebarPomoContent).display !== 'none';
    sidebarPomoContent.style.display = isContentOpen ? 'none' : 'inline';
    sidebarPomoContent.setAttribute('aria-hidden', isContentOpen ? 'true' : 'false');

    activate.style.backgroundColor = isContentOpen ? COLORS.INACTIVE : COLORS.ACTIVE;
    disable.style.backgroundColor = isContentOpen ? COLORS.ACTIVE : COLORS.INACTIVE;

    if (!isContentOpen) {
      sidebarPomoContent.focus();
    }
  }

  /**
   * Atualiza o ícone do botão btnOpenClose com base no estado do sidebarPomoContent.
   */
  function atualizarBotao() {
    const icon = btnOpenClose.querySelector('#iconLeftPomo');
    if (!icon) {
      console.warn('Ícone #iconLeftPomo não encontrado em btnOpenClose');
      return;
    }

    const isContentOpen = getComputedStyle(sidebarPomoContent).display !== 'none';
    console.log('atualizarBotao: isContentOpen=', isContentOpen); // Log para depuração
    if (!isContentOpen) { // Equivalente a "pausado"
      icon.classList.remove('bi-box-arrow-in-right');
      icon.classList.add('bi-box-arrow-left');
    } else {
      icon.classList.remove('bi-box-arrow-left');
      icon.classList.add('bi-box-arrow-in-right');
    }
  }

  // Evento para o botão de alternar
  btnOpenClose.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSidebar();
    atualizarBotao();
  });

  // Evento para o botão activate
  activate.addEventListener('click', (event) => {
    event.stopPropagation();
    sidebar.style.display = 'flex';
    sidebarPomoContent.style.display = 'none';
    sidebar.setAttribute('aria-hidden', 'false');
    sidebarPomoContent.setAttribute('aria-hidden', 'false');
    activate.style.backgroundColor = COLORS.ACTIVE;
    disable.style.backgroundColor = COLORS.INACTIVE;
    atualizarBotao();
    sidebarPomoContent.focus();
  });

  // Evento para o botão disable
  disable.addEventListener('click', (event) => {
    event.stopPropagation();
    sidebar.style.display = 'none';
    sidebarPomoContent.style.display = 'none';
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarPomoContent.setAttribute('aria-hidden', 'true');
    activate.style.backgroundColor = COLORS.INACTIVE;
    disable.style.backgroundColor = COLORS.ACTIVE;
    atualizarBotao();
  });

  // Fecha apenas o conteúdo ao clicar fora
  window.addEventListener('click', (event) => {
    if (event.target === sidebar && getComputedStyle(sidebar).display === 'flex') {
      sidebarPomoContent.style.display = 'none';
      sidebarPomoContent.setAttribute('aria-hidden', 'true');
      atualizarBotao();
    }
  });

  // Fecha apenas o conteúdo ao pressionar "Escape"
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && getComputedStyle(sidebar).display === 'flex') {
      sidebarPomoContent.style.display = 'none';
      sidebarPomoContent.setAttribute('aria-hidden', 'true');
      btnOpenClose.focus();
      atualizarBotao();
    }
  });

  // Impede que cliques no conteúdo acionem o fechamento
  sidebarPomoContent.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

// Inicializa a configuração
document.addEventListener('DOMContentLoaded', setupPomodoro);