// ModalConfig.js
export let ModalUp;
export let btnOpenUp;
export let btnCloseUp;

export function PomoModal() {
    // Quando o usuário clica no botão, abre o modal
    btnOpenUp.onclick = function() {
        ModalUp.style.display = "flex"; // Exibe o modal
    }

    // Quando o usuário clica no <span> (x), fecha o modal
    btnCloseUp.onclick = function() {
        ModalUp.style.display = "none"; // Esconde o modal
    }

    // Quando o usuário clica fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target == ModalUp) {
            ModalUp.style.display = "none"; // Esconde o modal
        }
    }
}

// Aguarde o carregamento do DOM
document.addEventListener("DOMContentLoaded", function() {
    // Obtém o modal
    ModalUp = document.getElementById("modalUp");
    // Obtém o botão que abre o modal
    btnOpenUp = document.getElementById("openModalUp");
    // Obtém o elemento <span> que fecha o modal
    btnCloseUp = document.getElementById("closeModalUp");

    // Chama a função para configurar o modal
    PomoModal();
});
