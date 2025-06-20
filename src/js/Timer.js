let intervalo;
let tempoRestante = 0;
let pausado = false;

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
}

function rodarContagem() {
  atualizarDisplay(tempoRestante);
  intervalo = setInterval(() => {
    if (!pausado) {
      tempoRestante--;
      atualizarDisplay(tempoRestante);

      if (tempoRestante <= 0) {
        clearInterval(intervalo); // Para o contador quando chegar a 0
      }
    }
  }, 1000);
}

function pausarOuContinuar() {
  if (tempoRestante <= 0) return;
  pausado = !pausado;
}

function resetarTimer() {
  clearInterval(intervalo);
  tempoRestante = 0;
  pausado = false;
  atualizarDisplay(0);
}

function atualizarDisplay(segundos) {
  let h = Math.floor(segundos / 3600);
  let m = Math.floor((segundos % 3600) / 60);
  let s = segundos % 60;

  // Atualiza o conteúdo dentro do div "timerDisplay"
  document.getElementById("timerDisplay").textContent =
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
