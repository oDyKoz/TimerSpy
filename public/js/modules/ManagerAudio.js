/**
 * Gerenciador de Áudio Personalizado para Timer
 * @author oDyKoz
 * @version 1.0.0
 */

export class CustomAudioManager {
  constructor(config = {}) {
    this.config = {
      inputSelector: config.inputSelector || '#customAlarmSound',
      feedbackSelector: config.feedbackSelector || '#audioFeedback',
      defaultSound: config.defaultSound || 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg?hl=pt-br',
      validationDelay: config.validationDelay || 800,
      allowedFormats: config.allowedFormats || ['.mp3', '.ogg', '.wav', '.m4a', '.aac'],
      ...config
    };

    this.audioInput = null;
    this.feedbackElement = null;
    this.validationTimeout = null;
    this.cachedAudio = null;
    this.isValid = false;
    this.currentUrl = '';

    this.init();
  }

  /**
   * Inicializa o gerenciador
   */
  init() {
    this.audioInput = document.querySelector(this.config.inputSelector);
    
    if (!this.audioInput) {
      console.error('Input de áudio personalizado não encontrado');
      return;
    }

    this.createFeedbackElement();
    this.bindEvents();
    this.loadSavedAudio();
  }

  /**
   * Cria elemento de feedback visual
   */
  createFeedbackElement() {
    let feedback = document.querySelector(this.config.feedbackSelector);
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = this.config.feedbackSelector.replace('#', '');
      feedback.className = 'audio-feedback';
      this.audioInput.parentNode.insertBefore(feedback, this.audioInput.nextSibling);
    }

    this.feedbackElement = feedback;
    this.applyFeedbackStyles();
  }

  /**
   * Aplica estilos ao feedback
   */
  applyFeedbackStyles() {
    Object.assign(this.feedbackElement.style, {
      marginTop: '8px',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '13px',
      display: 'none',
      transition: 'all 0.3s ease'
    });
  }

  /**
   * Vincula eventos ao input
   */
  bindEvents() {
    this.audioInput.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });

    this.audioInput.addEventListener('paste', (e) => {
      setTimeout(() => {
        this.handleInput(e.target.value);
      }, 10);
    });

    this.audioInput.addEventListener('blur', () => {
      if (this.audioInput.value.trim() && this.isValid) {
        this.saveAudioUrl();
      }
    });
  }

  /**
   * Manipula entrada do usuário
   */
  handleInput(value) {
    clearTimeout(this.validationTimeout);
    
    const url = value.trim();

    if (!url) {
      this.hideFeedback();
      this.isValid = false;
      this.currentUrl = '';
      return;
    }

    this.showFeedback('Validando...', 'loading');

    this.validationTimeout = setTimeout(() => {
      this.validateAudioUrl(url);
    }, this.config.validationDelay);
  }

  /**
   * Valida a URL do áudio
   */
  async validateAudioUrl(url) {
    try {
      // Validação básica de URL
      if (!this.isValidUrl(url)) {
        this.showFeedback('❌ URL inválida', 'error');
        this.isValid = false;
        return;
      }

      // Verifica formato de arquivo
      if (!this.hasValidFormat(url)) {
        this.showFeedback(
          `⚠️ Formato não recomendado. Use: ${this.config.allowedFormats.join(', ')}`,
          'warning'
        );
      }

      // Testa se o áudio pode ser carregado
      this.showFeedback('🔄 Testando áudio...', 'loading');
      
      const isPlayable = await this.testAudioPlayback(url);

      if (isPlayable) {
        this.showFeedback('✅ Áudio válido e pronto para uso!', 'success');
        this.isValid = true;
        this.currentUrl = url;
      } else {
        this.showFeedback('❌ Não foi possível carregar o áudio', 'error');
        this.isValid = false;
      }

    } catch (error) {
      console.error('Erro na validação:', error);
      this.showFeedback('❌ Erro ao validar áudio', 'error');
      this.isValid = false;
    }
  }

  /**
   * Verifica se é uma URL válida
   */
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /**
   * Verifica se tem formato de áudio válido
   */
  hasValidFormat(url) {
    const urlLower = url.toLowerCase();
    return this.config.allowedFormats.some(format => 
      urlLower.includes(format)
    );
  }

  /**
   * Testa se o áudio pode ser reproduzido
   */
  testAudioPlayback(url) {
    return new Promise((resolve) => {
      const audio = new Audio();
      const timeout = setTimeout(() => {
        audio.src = '';
        resolve(false);
      }, 5000);

      audio.addEventListener('canplaythrough', () => {
        clearTimeout(timeout);
        this.cachedAudio = audio;
        resolve(true);
      });

      audio.addEventListener('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });

      audio.src = url;
      audio.load();
    });
  }

  /**
   * Mostra feedback visual
   */
  showFeedback(message, type) {
    this.feedbackElement.textContent = message;
    this.feedbackElement.style.display = 'block';

    const colors = {
      success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
      error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
      warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
      loading: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
    };

    const style = colors[type] || colors.loading;
    Object.assign(this.feedbackElement.style, {
      backgroundColor: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`
    });
  }

  /**
   * Esconde feedback
   */
  hideFeedback() {
    this.feedbackElement.style.display = 'none';
  }

  /**
   * Salva URL no localStorage
   */
  saveAudioUrl() {
    if (this.isValid && this.currentUrl) {
      localStorage.setItem('customTimerAudio', this.currentUrl);
      console.log('✅ Áudio personalizado salvo:', this.currentUrl);
    }
  }

  /**
   * Carrega URL salva
   */
  loadSavedAudio() {
    const savedUrl = localStorage.getItem('customTimerAudio');
    if (savedUrl) {
      this.audioInput.value = savedUrl;
      this.validateAudioUrl(savedUrl);
    }
  }

  /**
   * Obtém a URL do áudio (personalizado ou padrão)
   */
  getAudioUrl() {
    return this.isValid && this.currentUrl 
      ? this.currentUrl 
      : this.config.defaultSound;
  }

  /**
   * Limpa o áudio personalizado
   */
  clearCustomAudio() {
    this.audioInput.value = '';
    this.currentUrl = '';
    this.isValid = false;
    this.cachedAudio = null;
    localStorage.removeItem('customTimerAudio');
    this.hideFeedback();
  }

  /**
   * Retorna o estado atual
   */
  getStatus() {
    return {
      isValid: this.isValid,
      currentUrl: this.currentUrl,
      hasCustomAudio: this.isValid && !!this.currentUrl,
      usingDefault: !this.isValid || !this.currentUrl
    };
  }

  /**
   * Testa o áudio atual
   */
  testCurrentAudio() {
    const url = this.getAudioUrl();
    const testAudio = new Audio(url);
    testAudio.volume = 0.5;
    
    testAudio.play().then(() => {
      setTimeout(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
      }, 2000);
    }).catch(error => {
      console.error('Erro ao testar áudio:', error);
      alert('Não foi possível reproduzir o áudio');
    });
  }
}

/**
 * Função de configuração para uso no Timer
 */
export function setupCustomAudio(config = {}) {
  const audioManager = new CustomAudioManager(config);
  
  // Expõe globalmente para uso no Timer
  window.customAudioManager = audioManager;
  
  return audioManager;
}