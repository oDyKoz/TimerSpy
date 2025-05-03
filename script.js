let intervalo;
let tempoRestante = 0;
let pausado = false;

function iniciarTimer() {
  clearInterval(intervalo); // limpa qualquer contador anterior
  pausado = false;

  let h = parseInt(document.getElementById("horas").value) || 0;
  let m = parseInt(document.getElementById("minutos").value) || 0;
  let s = parseInt(document.getElementById("segundos").value) || 0;

  tempoRestante = h * 3600 + m * 60 + s;

  if (tempoRestante <= 0) {
    alert("Digite um valor!");
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
        clearInterval(intervalo);
        alert("⏰ Timer finalizado!");
      }
    }
  }, 1000);
}

function pausarOuContinuar() {
  if (tempoRestante <= 0) return;
  pausado = !pausado;
  const btn = event.target;
  btn.textContent = pausado ? "Continuar" : "Pausar";
}

function resetarTimer() {
  clearInterval(intervalo);
  tempoRestante = 0;
  pausado = false;
  atualizarDisplay(0);
  document.querySelector("button[onclick='pausarOuContinuar()']").innerHTML = '<img src="img/pause.png" alt="Pausar" width="50">';
}

function atualizarDisplay(segundos) {
  let h = Math.floor(segundos / 3600);
  let m = Math.floor((segundos % 3600) / 60);
  let s = segundos % 60;

  document.getElementById("timerDisplay").textContent =
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}