document.addEventListener('DOMContentLoaded', () => {
  let intervalo;
  let tempoRestante = 0;
  let pausado = false;

  const controlButton = document.getElementById('controlButton');
  const resetButton = document.getElementById('resetButton');

  function iniciarTimer() {
    clearInterval(intervalo); // Limpa qualquer contador anterior
    pausado = false;

    let h = parseInt(document.getElementById("horas").value) || 0;
    let m = parseInt(document.getElementById("minutos").value) || 0;
    let s = parseInt(document.getElementById("segundos").value) || 0;

    tempoRestante = h * 3600 + m * 60 + s;

    if (tempoRestante <= 0) {
      // Se o tempo for menor ou igual a 0, não faz nada
      return;
    }

    rodarContagem();
    atualizarBotao();
  }

  function rodarContagem() {
    atualizarDisplay(tempoRestante);
    intervalo = setInterval(() => {
      if (!pausado) {
        tempoRestante--;
        atualizarDisplay(tempoRestante);

        if (tempoRestante <= 0) {
          clearInterval(intervalo); // Para o contador quando chegar a 0
          notificarConclusao();
        }
      }
    }, 1000);
  }

  function pausarOuContinuar() {
    if (tempoRestante <= 0) {
      iniciarTimer();
    } else {
      pausado = !pausado;
      atualizarBotao();
    }
  }

  function resetarTimer() {
    clearInterval(intervalo);
    tempoRestante = 0;
    pausado = false;
    atualizarDisplay(0);
    resetarBotao();
  }

  function atualizarDisplay(segundos) {
    let h = Math.floor(segundos / 3600);
    let m = Math.floor((segundos % 3600) / 60);
    let s = segundos % 60;

    const timerEl = document.getElementById("timerDisplay");
    timerEl.textContent =
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function atualizarBotao() {
    const icon = controlButton.querySelector('i');
    if (!icon) return;

    if (pausado) {
      icon.classList.remove("bi-caret-right-fill");
      icon.classList.add("bi-stop");
    } else {
      icon.classList.remove("bi-stop");
      icon.classList.add("bi-caret-right-fill");
    }
  }

  function resetarBotao() {
    const icon = controlButton.querySelector('i');
    if (!icon) return;

    icon.classList.remove("bi-stop");
    icon.classList.add("bi-caret-right-fill");
  }

  // URL do áudio padrão (pode ser alterada)
  const DEFAULT_ALARM_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';

  function notificarConclusao() {
    // 1. Obter o áudio personalizado ou usar o padrão
    const customSoundUrl = document.getElementById('customAlarmSound').value.trim();
    const alarmSound = new Audio(customSoundUrl || DEFAULT_ALARM_SOUND);
    alarmSound.loop = true;

    // 2. Criar notificação estilizada
    const notification = document.createElement('div');
    notification.id = 'alarmNotification';
    notification.innerHTML = `
      <div class="alarm-content">
        <i class="bi bi-alarm-fill"></i>
        <span>Timer finalizado!</span>
        <button id="stopAlarmBtn" style="background-color:#f55d5d; 
        color: #fff; border-radius: 3px; padding: 4px;">Parar</button>
      </div>
    `;
    
    // Estilos da notificação (pode ser movido para CSS)
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#ff4444';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '10000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.animation = 'fadeIn 0.3s ease-out';
    
    document.body.appendChild(notification);

    // 3. Tocar o alarme com tratamento de erro
    alarmSound.play().catch(error => {
      console.error('Erro ao tocar áudio personalizado:', error);
      // Fallback para áudio padrão
      const defaultSound = new Audio(DEFAULT_ALARM_SOUND);
      defaultSound.loop = true;
      defaultSound.play();
      alarmSound = defaultSound; // Atualiza a referência
    });

    // 4. Botão para parar o alarme
    document.getElementById('stopAlarmBtn').addEventListener('click', () => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      notification.remove();
    });

    // 5. Notificação do navegador (opcional)
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Timer Concluído', {
          body: 'O tempo definido acabou!',
          icon: '../src/svg/alarm_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Timer Concluído', {
              body: 'O tempo definido acabou!',
              icon: '../src/svg/alarm_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg'
            });
          }
        });
      }
    }

    // 6. Auto-remover após 30 segundos (opcional)
    setTimeout(() => {
      if (document.body.contains(notification)) {
        alarmSound.pause();
        notification.remove();
      }
    }, 30000);
  }

  // Eventos de clique
  controlButton.addEventListener('click', pausarOuContinuar);
  resetButton.addEventListener('click', resetarTimer);

  // Evento de teclado para Enter e Espaço
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Evita comportamentos padrão, como rolagem com espaço
      pausarOuContinuar();
    }
  });

  // Atualiza display inicial
  atualizarDisplay(0);
});