/**
 * Limita a entrada a 2 caracteres numéricos e corrige valores de tempo (horas, minutos, segundos) apenas se excederem o limite, preservando a posição do cursor.
 * @param {HTMLInputElement} input - O elemento de input a ser validado.
 * @param {string} type - O tipo de campo ('hours', 'minutes', 'seconds').
 */
export function limitarEntrada(input, type) {
  const cursorPos = input.selectionStart; // Salva a posição do cursor
  let valor = input.value.trim();

  // Limita a 2 caracteres
  if (valor.length > 2) {
    valor = valor.slice(0, 2);
  }

  let maxValue;
  switch (type) {
    case 'hours':
      maxValue = 23;
      break;
    case 'minutes':
    case 'seconds':
      maxValue = 59;
      break;
    default:
      console.error(`Tipo de campo inválido: ${type}`);
      return;
  }

  // Valida a entrada
  if (valor.length > 0) {
    if (!/^\d*$/.test(valor)) {
      input.value = '';
      console.warn(`Entrada não numérica em ${type}: ${valor}`);
      return;
    }

    const numero = parseInt(valor, 10);
    if (!isNaN(numero)) {
      if (numero > maxValue) {
        // Corrige apenas se exceder o limite
        const formattedValue = maxValue.toString().padStart(2, '0');
        input.value = formattedValue;
        // Ajusta a posição do cursor
        const newCursorPos = cursorPos + (formattedValue.length - valor.length);
        input.setSelectionRange(newCursorPos, newCursorPos);
        console.debug(`Valor ajustado para o máximo em ${type}: ${maxValue}`);
      } else if (numero >= 0) {
        // Mantém o valor digitado se válido, sem forçar formatação
        input.value = valor;
      } else {
        input.value = '';
        console.warn(`Valor inválido em ${type}: ${valor}`);
      }
    } else {
      input.value = '';
      console.warn(`Entrada não numérica em ${type}: ${valor}`);
    }
  } else {
    input.value = ''; // Limpa se vazio
  }
}

// Configura os inputs no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    { id: 'horas', type: 'hours' },
    { id: 'minutos', type: 'minutes' },
    { id: 'segundos', type: 'seconds' },
  ];

  inputs.forEach(({ id, type }) => {
    const input = document.getElementById(id);
    if (!input) {
      console.warn(`Input com ID ${id} não encontrado.`);
      return;
    }

    // Validação no evento blur
    input.addEventListener('blur', () => limitarEntrada(input, type));

    // Validação ao pressionar Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        limitarEntrada(input, type);
        // Move o foco para o próximo input, se houver
        const nextInput = input.parentElement.querySelector(`input[id="${inputs[inputs.findIndex(i => i.id === id) + 1]?.id}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    });

    // Impede colagem de texto inválido
    input.addEventListener('paste', (e) => {
      const pastedData = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^\d*$/.test(pastedData) || pastedData.length > 2) {
        e.preventDefault();
        console.debug(`Colagem inválida bloqueada em ${id}: ${pastedData}`);
      }
    });
  });
});