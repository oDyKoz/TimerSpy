// ModalConfig.js
export let myModal;
export let btnOpen;
export let btnClose;

export function ConfigModal() {
    // Quando o usuário clica no botão, abre o modal
    btnOpen.onclick = function() {
        myModal.style.display = "flex"; // Exibe o modal
    }

    // Quando o usuário clica no <span> (x), fecha o modal
    btnClose.onclick = function() {
        myModal.style.display = "none"; // Esconde o modal
    }

    // Quando o usuário clica fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target == myModal) {
            myModal.style.display = "none"; // Esconde o modal
        }
    }
};

// Aguarde o carregamento do DOM
document.addEventListener("DOMContentLoaded", function() {
    // Obtém o modal
    myModal = document.getElementById("myModal");
    // Obtém o botão que abre o modal
    btnOpen = document.getElementById("openModal");
    // Obtém o elemento <span> que fecha o modal
    btnClose = document.getElementById("closeModal");

    // Chama a função para configurar o modal
    ConfigModal();
});
