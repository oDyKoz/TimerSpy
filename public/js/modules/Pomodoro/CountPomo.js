/**
 * Sistema Pomodoro Integrado com Timer
 * @author oDyKoz
 * @version 1.0.0
 */

class PomodoroController {
  constructor(timerInstance) {
    // Referência à instância do Timer
    this.timer = timerInstance;
    
    // Configurações padrão do Pomodoro
    this.config = {
      tempoTrabalho: 25, // minutos
      tempoIntervalo: 5,  // minutos
      numeroCiclos: 4,    // quantidade de pomodoros antes da pausa longa
      tempoIntervalLongo: 15 // minutos
    };

    // Estado atual do Pomodoro
    this.estado = {
      cicloAtual: 0,
      emPausa: false,
      emExecucao: false,
      totalCiclos: 0
    };

    // Cache de elementos DOM
    this.elements = {};
    
    // Inicialização
    this.init();
  }

  /**
   * Inicializa o sistema Pomodoro
   */
  init() {
    this.cacheElements();
    this.carregarConfigSalva();
    this.preencherInputsComValoresPadrao();
    this.bindEvents();
    this.setupTimerCallbacks();
  }

  /**
   * Armazena referências dos elementos DOM
   */
  cacheElements() {
    this.elements = {
      minutosPomo: document.querySelector('#minutosPomo'),
      loopPomo: document.querySelector('#LoopPomo'),
      stopPomo: document.querySelector('#StopPomo'),
      btnSave: document.querySelector('#sidebarPomoSave button'),
      btnOpenClose: document.querySelector('#btnOpenClose'),
      timerDisplay: document.querySelector('#timerDisplay'),
      controlButton: document.querySelector('#controlButton'),
      statusIndicator: this.criarIndicadorStatus()
    };
  }

  /**
   * Cria um indicador visual do status do Pomodoro
   */
  criarIndicadorStatus() {
    const indicator = document.createElement('div');
    indicator.id = 'pomodoroStatus';
    indicator.style.cssText = `
      position: fixed;
      top: 40px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      display: none;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(indicator);
    return indicator;
  }

  /**
   * Carrega configuração salva do localStorage
   */
  carregarConfigSalva() {
    try {
      const configSalva = localStorage.getItem('pomodoroConfig');
      if (configSalva) {
        const parsed = JSON.parse(configSalva);
        this.config = { ...this.config, ...parsed };
        console.log('✓ Configuração Pomodoro carregada:', this.config);
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração Pomodoro:', error);
    }
  }

  /**
   * Preenche os inputs com valores padrão/salvos
   */
  preencherInputsComValoresPadrao() {
    if (this.elements.minutosPomo) {
      this.elements.minutosPomo.value = this.config.tempoTrabalho;
      this.elements.minutosPomo.placeholder = `Padrão: ${this.config.tempoTrabalho}`;
    }
    
    if (this.elements.loopPomo) {
      this.elements.loopPomo.value = this.config.numeroCiclos;
      this.elements.loopPomo.placeholder = `Padrão: ${this.config.numeroCiclos}`;
    }
    
    if (this.elements.stopPomo) {
      this.elements.stopPomo.value = this.config.tempoIntervalo;
      this.elements.stopPomo.placeholder = `Padrão: ${this.config.tempoIntervalo}`;
    }
  }

  /**
   * Vincula eventos aos elementos
   */
  bindEvents() {
    // Botão de salvar configurações
    if (this.elements.btnSave) {
      this.elements.btnSave.addEventListener('click', () => this.salvarConfiguracao());
    }

    // Intercepta o botão de controle do timer
    if (this.elements.controlButton) {
      this.elements.controlButton.addEventListener('click', (e) => {
        if (!this.estado.emExecucao && !this.timer.isRunning) {
          this.iniciarPomodoro();
        }
      });
    }

    // Validação dos inputs
    this.setupInputValidation();
  }

  /**
   * Configura validação dos inputs do Pomodoro
   */
  setupInputValidation() {
    const inputs = [
      { element: this.elements.minutosPomo, max: 60, min: 1 },
      { element: this.elements.loopPomo, max: 10, min: 1 },
      { element: this.elements.stopPomo, max: 30, min: 1 }
    ];

    inputs.forEach(({ element, max, min }) => {
      if (!element) return;

      element.addEventListener('input', () => {
        // Remove caracteres não-numéricos
        element.value = element.value.replace(/\D/g, '');
        
        // Limita o comprimento
        if (element.value.length > 2) {
          element.value = element.value.slice(0, 2);
        }
      });

      element.addEventListener('blur', () => {
        let valor = parseInt(element.value);
        
        if (isNaN(valor) || valor < min) {
          valor = min;
        } else if (valor > max) {
          valor = max;
        }
        
        element.value = valor;
      });
    });
  }

  /**
   * Salva a configuração do Pomodoro
   */
  salvarConfiguracao() {
    const novaConfig = {
      tempoTrabalho: parseInt(this.elements.minutosPomo?.value) || this.config.tempoTrabalho,
      numeroCiclos: parseInt(this.elements.loopPomo?.value) || this.config.numeroCiclos,
      tempoIntervalo: parseInt(this.elements.stopPomo?.value) || this.config.tempoIntervalo
    };

    // Validação
    if (novaConfig.tempoTrabalho < 1 || novaConfig.tempoTrabalho > 60) {
      this.mostrarNotificacao('⚠️ Tempo de trabalho deve estar entre 1-60 min', 'warning');
      return;
    }

    this.config = { ...this.config, ...novaConfig };
    
    try {
      localStorage.setItem('pomodoroConfig', JSON.stringify(this.config));
      this.mostrarNotificacao('✓ Configuração salva com sucesso!', 'success');
      console.log('✓ Nova configuração Pomodoro:', this.config);
    } catch (error) {
      this.mostrarNotificacao('✗ Erro ao salvar configuração', 'error');
      console.error('Erro ao salvar configuração:', error);
    }
  }

  /**
   * Configura callbacks do Timer
   */
  setupTimerCallbacks() {
    // Sobrescreve os callbacks do timer para integração
    const originalOnComplete = this.timer.config.onComplete;
    
    this.timer.config.onComplete = () => {
      if (originalOnComplete) originalOnComplete();
      this.onTimerComplete();
    };
  }

  /**
   * Inicia o ciclo Pomodoro
   */
  iniciarPomodoro() {
    if (this.estado.emExecucao) {
      console.warn('Pomodoro já está em execução');
      return;
    }

    // Reseta o estado se for um novo início
    if (this.estado.cicloAtual === 0) {
      this.estado.totalCiclos = 0;
    }

    this.estado.emExecucao = true;
    this.estado.emPausa = false;
    this.estado.cicloAtual++;

    // Envia tempo de trabalho para o Timer
    const minutos = this.config.tempoTrabalho;
    this.enviarTempoParaTimer(0, minutos, 0);
    
    this.atualizarStatusVisual('trabalho');
    this.mostrarNotificacao(`🍅 Pomodoro ${this.estado.cicloAtual} iniciado!`, 'info');
    
    console.log(`Pomodoro iniciado - Ciclo ${this.estado.cicloAtual}/${this.config.numeroCiclos}`);
  }

  /**
   * Envia tempo para a API do Timer
   */
  enviarTempoParaTimer(horas, minutos, segundos) {
    console.log(`📤 Enviando para Timer API: ${horas}h ${minutos}m ${segundos}s`);
    
    // Define os valores nos inputs do timer
    this.timer.setTempo(horas, minutos, segundos);
    
    // Inicia o timer
    const sucesso = this.timer.iniciarTimer();
    
    if (!sucesso) {
      this.mostrarNotificacao('✗ Erro ao iniciar timer', 'error');
      this.estado.emExecucao = false;
    }
  }

  /**
   * Chamado quando o timer completa
   */
  onTimerComplete() {
    if (!this.estado.emExecucao) return;

    if (this.estado.emPausa) {
      // Pausa completada, iniciar próximo ciclo de trabalho
      this.iniciarProximoCicloTrabalho();
    } else {
      // Trabalho completado, iniciar pausa
      this.iniciarPausa();
    }
  }

  /**
   * Inicia uma pausa
   */
  iniciarPausa() {
    this.estado.emPausa = true;
    this.estado.totalCiclos++;

    // Determina o tipo de pausa
    const isPausaLonga = this.estado.cicloAtual >= this.config.numeroCiclos;
    const tempoPausa = isPausaLonga ? this.config.tempoIntervalLongo : this.config.tempoIntervalo;
    const tipoPausa = isPausaLonga ? 'longa' : 'curta';

    // Envia tempo de pausa para o Timer
    this.enviarTempoParaTimer(0, tempoPausa, 0);
    
    this.atualizarStatusVisual('pausa', tipoPausa);
    this.mostrarNotificacao(
      `☕ Pausa ${tipoPausa} iniciada (${tempoPausa} min)`, 
      'success'
    );

    console.log(`Pausa ${tipoPausa} iniciada - ${tempoPausa} minutos`);

    // Se foi pausa longa, reseta o contador de ciclos
    if (isPausaLonga) {
      this.estado.cicloAtual = 0;
    }
  }

  /**
   * Inicia o próximo ciclo de trabalho após pausa
   */
  iniciarProximoCicloTrabalho() {
    this.estado.emPausa = false;
    this.estado.cicloAtual++;

    // Envia tempo de trabalho para o Timer
    const minutos = this.config.tempoTrabalho;
    this.enviarTempoParaTimer(0, minutos, 0);
    
    this.atualizarStatusVisual('trabalho');
    this.mostrarNotificacao(`🍅 Pomodoro ${this.estado.cicloAtual} iniciado!`, 'info');
    
    console.log(`Novo ciclo de trabalho - ${this.estado.cicloAtual}/${this.config.numeroCiclos}`);
  }

  /**
   * Atualiza o indicador visual de status
   */
  atualizarStatusVisual(tipo, subtipo = '') {
    const indicator = this.elements.statusIndicator;
    if (!indicator) return;

    let texto = '';
    let cor = '';

    switch (tipo) {
      case 'trabalho':
        texto = `🍅 Pomodoro ${this.estado.cicloAtual}/${this.config.numeroCiclos}`;
        cor = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        break;
      case 'pausa':
        texto = subtipo === 'longa' ? '☕ Pausa Longa' : '☕ Pausa Curta';
        cor = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        break;
    }

    indicator.textContent = texto;
    indicator.style.background = cor;
    indicator.style.display = 'block';

    // Adiciona animação
    indicator.style.animation = 'none';
    setTimeout(() => {
      indicator.style.animation = 'pulse 2s ease-in-out infinite';
    }, 10);
  }

  /**
   * Mostra notificação temporária
   */
  mostrarNotificacao(mensagem, tipo = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    // Define cor baseada no tipo
    const cores = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    notification.style.backgroundColor = cores[tipo] || cores.info;
    notification.textContent = mensagem;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Para o Pomodoro manualmente
   */
  pararPomodoro() {
    this.estado.emExecucao = false;
    this.estado.emPausa = false;
    this.estado.cicloAtual = 0;
    this.elements.statusIndicator.style.display = 'none';
    this.timer.resetarTimer();
    this.mostrarNotificacao('⏹️ Pomodoro parado', 'warning');
  }

  /**
   * Obtém estatísticas do Pomodoro
   */
  obterEstatisticas() {
    return {
      cicloAtual: this.estado.cicloAtual,
      totalCiclos: this.estado.totalCiclos,
      emPausa: this.estado.emPausa,
      emExecucao: this.estado.emExecucao,
      configuracao: { ...this.config }
    };
  }
}

/**
 * Função de setup para exportação
 */
export function setupCountPomodoro() {
  // Aguarda o Timer ser inicializado
  const checkTimer = setInterval(() => {
    if (window.timerInstance) {
      clearInterval(checkTimer);
      
      // Cria instância global do Pomodoro
      window.pomodoroController = new PomodoroController(window.timerInstance);
      
      // Adiciona estilos de animação
      addPomodoroStyles();
      
      console.log('✓ Sistema Pomodoro inicializado com sucesso!');
    }
  }, 100);

  // Timeout de segurança
  setTimeout(() => {
    clearInterval(checkTimer);
    if (!window.pomodoroController) {
      console.error('✗ Timeout: Timer não foi inicializado');
    }
  }, 5000);
}

/**
 * Adiciona estilos CSS necessários
 */
function addPomodoroStyles() {
  if (document.getElementById('pomodoro-styles')) return;

  const style = document.createElement('style');
  style.id = 'pomodoro-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideDown {
      from {
        transform: translate(-50%, -100%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0);
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        transform: translate(-50%, 0);
        opacity: 1;
      }
      to {
        transform: translate(-50%, -100%);
        opacity: 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  `;
  document.head.appendChild(style);
}