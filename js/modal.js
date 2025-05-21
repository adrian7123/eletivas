// Função para fechar o modal com animação suave
function closeFullscreenModal(modal, modalImg) {
  // Remove as classes de visibilidade com animação
  modalImg.classList.remove('visible');
  modal.classList.remove('visible');
  
  // Após a transição, oculta o modal
  setTimeout(() => {
    modal.style.display = "none";
    document.removeEventListener("keydown", handleKeyNavigation);
  }, 300);
}
