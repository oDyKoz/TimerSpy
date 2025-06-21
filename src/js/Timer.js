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

  function notificarConclusao() {
    console.log("Timer concluído!");
    alert("Timer concluído!");
  }

  // Eventos
  controlButton.addEventListener('click', pausarOuContinuar);
  resetButton.addEventListener('click', resetarTimer);

  // Atualiza display inicial
  atualizarDisplay(0);
});
