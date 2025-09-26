/**
 * Timer Modular - Classe reutilizável para contadores regressivos
 * @author oDyKoz
 * @version 1.0.0
 */

class Timer {
  constructor(config = {}) {
    // Configurações padrão
    this.config = {
      // Seletores dos elementos HTML
      horasInput: config.horasInput || '#horas',
      minutosInput: config.minutosInput || '#minutos',
      segundosInput: config.segundosInput || '#segundos',
      displayElement: config.displayElement || '#timerDisplay',
      controlButton: config.controlButton || '#controlButton',
      resetButton: config.resetButton || '#resetButton',
      customSoundInput: config.customSoundInput || '#customAlarmSound',
      
      // Configurações de áudio
      defaultAlarmSound: config.defaultAlarmSound || 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg?hl=pt-br',
      alarmIcon: config.alarmIcon || '../src/svg/alarm_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
      
      // Configurações de comportamento
      enableKeyboardShortcuts: config.enableKeyboardShortcuts !== false,
      enableNotifications: config.enableNotifications !== false,
      autoRemoveNotification: config.autoRemoveNotification !== false,
      autoRemoveTimeout: config.autoRemoveTimeout || 30000,
      
      // Classes CSS personalizadas
      playIconClass: config.playIconClass || 'bi-caret-right-fill',
      stopIconClass: config.stopIconClass || 'bi-stop',
      alarmIconClass: config.alarmIconClass || 'bi-alarm-fill',
      
      // Callbacks personalizados
      onStart: config.onStart || null,
      onPause: config.onPause || null,
      onReset: config.onReset || null,
      onComplete: config.onComplete || null,
      onTick: config.onTick || null,
      
      ...config
    };

    // Estado interno
    this.intervalo = null;
    this.tempoRestante = 0;
    this.pausado = false;
    this.isRunning = false;

    // Cache dos elementos DOM
    this.elements = {};
    
    // Inicialização
    this.init();
  }

  /**
   * Inicializa o timer
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.atualizarDisplay(0);
  }

  /**
   * Armazena referências dos elementos DOM em cache
   */
  cacheElements() {
    const selectors = [
      'horasInput', 'minutosInput', 'segundosInput', 
      'displayElement', 'controlButton', 'resetButton', 'customSoundInput'
    ];

    selectors.forEach(selector => {
      const element = document.querySelector(this.config[selector]);
      if (element) {
        this.elements[selector] = element;
      } else {
        console.warn(`Elemento não encontrado: ${this.config[selector]}`);
      }
    });
  }

  /**
   * Vincula os eventos aos elementos
   */
  bindEvents() {
    // Eventos dos botões
    if (this.elements.controlButton) {
      this.elements.controlButton.addEventListener('click', () => this.pausarOuContinuar());
    }
    
    if (this.elements.resetButton) {
      this.elements.resetButton.addEventListener('click', () => this.resetarTimer());
    }

    // Atalhos de teclado
    if (this.config.enableKeyboardShortcuts) {
      document.addEventListener('keydown', (event) => this.handleKeyboard(event));
    }
  }

  /**
   * Manipula eventos de teclado
   */
  handleKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.pausarOuContinuar();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.resetarTimer();
    }
  }

  /**
   * Inicia o timer
   */
  iniciarTimer() {
    this.clearInterval();
    this.pausado = false;

    const tempo = this.obterTempoInputs();
    this.tempoRestante = tempo.total;

    if (this.tempoRestante <= 0) {
      console.warn('Tempo inválido para iniciar o timer');
      return false;
    }

    this.isRunning = true;
    this.rodarContagem();
    this.atualizarBotao();
    
    // Callback personalizado
    if (typeof this.config.onStart === 'function') {
      this.config.onStart(tempo);
    }

    return true;
  }

  /**
   * Obtém o tempo dos inputs
   */
  obterTempoInputs() {
    const h = parseInt(this.elements.horasInput?.value) || 0;
    const m = parseInt(this.elements.minutosInput?.value) || 0;
    const s = parseInt(this.elements.segundosInput?.value) || 0;

    return {
      horas: h,
      minutos: m,
      segundos: s,
      total: h * 3600 + m * 60 + s
    };
  }

  /**
   * Executa a contagem regressiva
   */
  rodarContagem() {
    this.atualizarDisplay(this.tempoRestante);
    
    this.intervalo = setInterval(() => {
      if (!this.pausado) {
        this.tempoRestante--;
        this.atualizarDisplay(this.tempoRestante);

        // Callback de tick
        if (typeof this.config.onTick === 'function') {
          this.config.onTick(this.tempoRestante, this.formatarTempo(this.tempoRestante));
        }

        if (this.tempoRestante <= 0) {
          this.completarTimer();
        }
      }
    }, 1000);
  }

  /**
   * Pausa ou continua o timer
   */
  pausarOuContinuar() {
    if (this.tempoRestante <= 0 && !this.isRunning) {
      return this.iniciarTimer();
    } 
    
    if (this.isRunning) {
      this.pausado = !this.pausado;
      this.atualizarBotao();

      // Callback personalizado
      const callback = this.pausado ? this.config.onPause : this.config.onStart;
      if (typeof callback === 'function') {
        callback(this.formatarTempo(this.tempoRestante));
      }
    }
  }

  /**
   * Reseta o timer
   */
  resetarTimer() {
    this.clearInterval();
    this.tempoRestante = 0;
    this.pausado = false;
    this.isRunning = false;
    this.atualizarDisplay(0);
    this.resetarBotao();

    // Callback personalizado
    if (typeof this.config.onReset === 'function') {
      this.config.onReset();
    }
  }

  /**
   * Completa o timer
   */
  completarTimer() {
    this.clearInterval();
    this.isRunning = false;
    this.notificarConclusao();

    // Callback personalizado
    if (typeof this.config.onComplete === 'function') {
      this.config.onComplete();
    }
  }

  /**
   * Limpa o intervalo
   */
  clearInterval() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  /**
   * Atualiza o display do timer
   */
  atualizarDisplay(segundos) {
    if (!this.elements.displayElement) return;

    const tempo = this.formatarTempo(segundos);
    this.elements.displayElement.textContent = tempo.formatted;
  }

  /**
   * Formata o tempo em horas:minutos:segundos
   */
  formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    return {
      horas: h,
      minutos: m,
      segundos: s,
      formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    };
  }

  /**
   * Atualiza o ícone do botão de controle
   */
  atualizarBotao() {
    const icon = this.elements.controlButton?.querySelector('i');
    if (!icon) return;

    const { playIconClass, stopIconClass } = this.config;

    if (this.pausado) {
      icon.classList.remove(playIconClass);
      icon.classList.add(stopIconClass);
    } else {
      icon.classList.remove(stopIconClass);
      icon.classList.add(playIconClass);
    }
  }

  /**
   * Reseta o ícone do botão
   */
  resetarBotao() {
    const icon = this.elements.controlButton?.querySelector('i');
    if (!icon) return;

    const { playIconClass, stopIconClass } = this.config;
    icon.classList.remove(stopIconClass);
    icon.classList.add(playIconClass);
  }

  /**
   * Notifica a conclusão do timer
   */
  notificarConclusao() {
    const customSoundUrl = this.elements.customSoundInput?.value.trim();
    const alarmSound = new Audio(customSoundUrl || this.config.defaultAlarmSound);
    alarmSound.loop = true;

    // Criar notificação visual
    const notification = this.criarNotificacaoVisual(alarmSound);
    document.body.appendChild(notification);

    // Tocar áudio com fallback
    this.tocarAudio(alarmSound);

    // Notificação do navegador
    if (this.config.enableNotifications) {
      this.criarNotificacaoNavegador();
    }

    // Auto-remover notificação
    if (this.config.autoRemoveNotification) {
      this.autoRemoverNotificacao(notification, alarmSound);
    }
  }

  /**
   * Cria a notificação visual
   */
  criarNotificacaoVisual(alarmSound) {
    const notification = document.createElement('div');
    notification.id = 'alarmNotification';
    notification.innerHTML = `
      <div class="alarm-content">
        <i class="${this.config.alarmIconClass}"></i>
        <span>Timer finalizado!</span>
        <button id="stopAlarmBtn" style="background-color:#f55d5d; 
        color: #fff; border-radius: 3px; padding: 4px;">Parar</button>
      </div>
    `;
    
    this.aplicarEstilosNotificacao(notification);
    
    // Evento do botão parar
    notification.querySelector('#stopAlarmBtn').addEventListener('click', () => {
      this.pararAlarme(alarmSound, notification);
    });

    return notification;
  }

  /**
   * Aplica estilos à notificação
   */
  aplicarEstilosNotificacao(notification) {
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'fadeIn 0.3s ease-out'
    });
  }

  /**
   * Toca o áudio com tratamento de erro
   */
  tocarAudio(alarmSound) {
    alarmSound.play().catch(error => {
      console.error('Erro ao tocar áudio personalizado:', error);
      // Fallback para áudio padrão
      const defaultSound = new Audio(this.config.defaultAlarmSound);
      defaultSound.loop = true;
      defaultSound.play().catch(fallbackError => {
        console.error('Erro ao tocar áudio padrão:', fallbackError);
      });
    });
  }

  /**
   * Cria notificação do navegador
   */
  criarNotificacaoNavegador() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification('Timer Concluído', {
        body: 'O tempo definido acabou!',
        icon: this.config.alarmIcon
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Timer Concluído', {
            body: 'O tempo definido acabou!',
            icon: this.config.alarmIcon
          });
        }
      });
    }
  }

  /**
   * Remove automaticamente a notificação
   */
  autoRemoverNotificacao(notification, alarmSound) {
    setTimeout(() => {
      if (document.body.contains(notification)) {
        this.pararAlarme(alarmSound, notification);
      }
    }, this.config.autoRemoveTimeout);
  }

  /**
   * Para o alarme e remove a notificação
   */
  pararAlarme(alarmSound, notification) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    notification.remove();
  }

  // Métodos públicos para controle externo
  
  /**
   * Define um novo tempo programaticamente
   */
  setTempo(horas, minutos, segundos) {
    if (this.elements.horasInput) this.elements.horasInput.value = horas || 0;
    if (this.elements.minutosInput) this.elements.minutosInput.value = minutos || 0;
    if (this.elements.segundosInput) this.elements.segundosInput.value = segundos || 0;
  }

  /**
   * Obtém o estado atual do timer
   */
  getEstado() {
    return {
      tempoRestante: this.tempoRestante,
      pausado: this.pausado,
      isRunning: this.isRunning,
      tempoFormatado: this.formatarTempo(this.tempoRestante)
    };
  }

  /**
   * Inicia o timer com tempo específico
   */
  iniciarComTempo(horas, minutos, segundos) {
    this.setTempo(horas, minutos, segundos);
    return this.iniciarTimer();
  }

  /**
   * Destroi o timer e limpa eventos
   */
  destroy() {
    this.clearInterval();
    // Remove listeners se necessário
    // Limpa referências
    this.elements = {};
  }
}

// Função de inicialização para compatibilidade com o código original
function initTimer(config = {}) {
  return new Timer(config);
}

// Exportações para diferentes sistemas de módulos
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { Timer, initTimer };
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define(() => ({ Timer, initTimer }));
} else {
  // Global
  window.Timer = Timer;
  window.initTimer = initTimer;
}

// Inicialização automática quando o DOM estiver pronto (compatibilidade)
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa apenas se não foi explicitamente desabilitado
  if (!window.DISABLE_AUTO_TIMER_INIT) {
    window.timerInstance = new Timer();
  }
});