// ModalConfig.js
export let inputNumbers;

export function limitarEntrada(input) {
    // Limita a entrada a 2 dígitos
    if (input.value.length > 2) {
        input.value = input.value.slice(0, 2);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Obtém todos os elementos de entrada do tipo number
    inputNumbers = document.querySelectorAll('.inputs input[type="number"]');

    // Adiciona o evento de entrada a cada campo
    inputNumbers.forEach(input => {
        input.addEventListener('input', () => limitarEntrada(input));
    });
});
