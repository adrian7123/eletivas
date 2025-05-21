// Inicializa a API com a URL base das configurações
const api = new Api(
  window.appConfig ? window.appConfig.apiUrl : "http://localhost:3004"
);
let cards = [];
let userName = localStorage.getItem("userName") || "";
let authName = localStorage.getItem("authName") || "";
let admin = localStorage.getItem("admin") || false;

// Inicializa o WebSocketManager
const wsManager = new WebSocketManager(
  window.appConfig ? window.appConfig.apiUrl : "http://localhost:3004"
);

// Configurar callbacks para WebSocket
wsManager.onNewCard(async (newCard) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // Formatar o novo card recebido via WebSocket
  const formattedCard = {
    id: newCard._id,
    content: newCard.content,
    date: formatDate(newCard.createdAt),
    author: newCard.author || "",
    medias: newCard.medias || [],
  };

  // Adiciona o novo card no início da lista se não for do usuário atual
  if (!cards.find((card) => card.id === formattedCard.id)) {
    cards.unshift(formattedCard);
    updateCards();
    showNotification("Novo card publicado por " + formattedCard.author);
  }
});

wsManager.onCardDeleted((deletedCardId) => {
  // Remove o card da lista local
  const initialLength = cards.length;
  cards = cards.filter((card) => card.id !== deletedCardId);

  // Se algum card foi removido, atualiza a interface
  if (cards.length < initialLength) {
    updateCards();
    showNotification("Um card foi removido");
  }
});

wsManager.onConnect(() => {
  console.log("Conectado ao servidor WebSocket");
});

wsManager.onDisconnect(() => {
  console.log("Desconectado do servidor WebSocket");
  // A reconexão é tratada automaticamente pelo WebSocketManager
});

// Função para verificar se o usuário já forneceu o nome
function checkUserName() {
  const nameModal = document.getElementById("nameModal");
  const submitBtn = document.getElementById("submitName");
  const userNameInput = document.getElementById("userName");
  const nameError = document.getElementById("nameError");
  const userWelcome = document.getElementById("userWelcome");
  const logoutBtn = document.getElementById("logoutBtn");
  const createCardContainer = document.getElementById("createCardContainer");
  const loginCardContainer = document.getElementById("loginCardContainer");
  const showLoginBtn = document.getElementById("showLoginBtn");
  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === nameModal) {
      nameModal.classList.remove("visible");
    }
  });
  // Configurar botão de mostrar login
  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", () => {
      nameModal.classList.add("visible");
    });
  }

  // Configurar o botão de logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userName");
      localStorage.removeItem("authName");
      localStorage.removeItem("admin");
      userName = "";
      authName = "";
      admin = false;
      nameModal.classList.remove("visible"); // Não mostra o modal automaticamente
      userWelcome.textContent = "";

      // Oculta o formulário de criar card e mostra o botão de login
      if (createCardContainer) createCardContainer.style.display = "none";
      if (loginCardContainer) loginCardContainer.style.display = "block";
      updateCards();
    });
  }

  // Atualizar a mensagem de boas-vindas
  if (userWelcome && userName) {
    userWelcome.textContent = `Olá, ${userName}!`;
  }
  // Gerencia a visibilidade baseada no estado de login
  if (userName) {
    // Usuário logado
    nameModal.classList.remove("visible");
    if (createCardContainer) createCardContainer.style.display = "block";
    if (loginCardContainer) loginCardContainer.style.display = "none";
  } else {
    // Usuário não logado
    nameModal.classList.remove("visible"); // Inicia sem mostrar o modal
    if (createCardContainer) createCardContainer.style.display = "none";
    if (loginCardContainer) loginCardContainer.style.display = "block";
  }

  // Carrega os cards independentemente do login
  loadCards();

  // Caso contrário, configura o modal
  submitBtn.addEventListener("click", async () => {
    const name = userNameInput.value.trim();
    if (name.length < 2) {
      nameError.textContent =
        "Por favor, digite um nome válido (mínimo 2 caracteres)";
      return;
    }

    userNameInput.value = ""; // Limpa o campo de entrada

    const res = await api.post("/api/user/login", { name });

    userName = res.name;
    admin = res.admin;
    authName = name;

    localStorage.setItem("userName", userName);
    localStorage.setItem("authName", authName);
    localStorage.setItem("admin", admin);

    nameModal.classList.remove("visible");

    updateCards();

    if (userWelcome) {
      userWelcome.textContent = `Olá, ${userName}!`;
    }

    // Atualiza a visibilidade dos elementos após login
    const createCardContainer = document.getElementById("createCardContainer");
    const loginCardContainer = document.getElementById("loginCardContainer");
    if (createCardContainer) createCardContainer.style.display = "block";
    if (loginCardContainer) loginCardContainer.style.display = "none";
  });

  // Permite submeter com a tecla Enter
  userNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });
}

// Inicia verificação de nome ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  checkUserName();
});

const showSkeleton = () => {
  const container = document.querySelector(".container2");
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "card skeleton-card";
    skeleton.innerHTML = `
      <div class="skeleton skeleton-text" style="width: 40%; height: 16px; margin-bottom: 8px;"></div>
      <div class="skeleton skeleton-text" style="width: 90%; height: 20px;"></div>
      <div class="skeleton skeleton-text" style="width: 70%; height: 20px; margin-top: 6px;"></div>
    `;
    container.appendChild(skeleton);
  }
};

// Função para carregar cards da API
const loadCards = async () => {
  showSkeleton();
  try {
    const response = await api.get("/api/cards");

    // Mapeia os dados da API para o formato utilizado pelo frontend
    cards = response.map((card) => ({
      id: card._id,
      content: card.content,
      date: formatDate(card.createdAt),
      author: card.author || "",
      medias: card.medias || [], // Certifica que temos o array de imagens
    }));

    updateCards();
  } catch (error) {
    console.error("Erro ao carregar cards:", error);

    // Verifica se já temos cards em cache
    if (cards.length === 0) {
      // Mostra notificação apenas se não houver dados locais
      showNotification(
        "Não foi possível conectar à API. Usando dados locais.",
        "warning"
      );
    }
    updateCards();
  }
};

// Função para formatar a data no formato relativo
function formatDate(dateString) {
  if (!dateString) return "Agora";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHrs < 24) return `${diffHrs}h atrás`;
  if (diffDays < 30) return `${diffDays}d atrás`;

  return date.toLocaleDateString("pt-BR");
}

let selectedImages = [];

const cardImageInput = document.getElementById("cardImage");
const previewGrid = document.getElementById("previewGrid");

function renderPreviewGrid() {
  previewGrid.innerHTML = "";
  previewGrid.style.display = "grid";
  previewGrid.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(100px, 1fr))";
  previewGrid.style.gridGap = "8px";

  selectedImages.forEach((imgObj, idx) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "block";

    const img = document.createElement("img");
    img.src = imgObj.url;
    img.style.width = "100%";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.cursor = "pointer";
    img.onclick = () => {
      openFullscreen(imgObj.url);
    };

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "×";
    removeBtn.title = "Remover imagem";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "2px";
    removeBtn.style.right = "2px";
    removeBtn.style.background = "rgba(255,0,0,0.8)";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "22px";
    removeBtn.style.height = "22px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontWeight = "bold";
    removeBtn.onclick = (e) => {
      e.stopPropagation(); // Impede que o clique no botão abra a imagem
      selectedImages.splice(idx, 1);
      renderPreviewGrid();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    previewGrid.appendChild(wrapper);
  });
}

if (cardImageInput) {
  cardImageInput.addEventListener("change", () => {
    for (let i = 0; i < cardImageInput.files.length; i++) {
      const file = cardImageInput.files[i];
      selectedImages.push({ url: URL.createObjectURL(file), file });
    }
    cardImageInput.value = "";
    renderPreviewGrid();
  });
}

const createCard = async () => {
  const cardContent = document.getElementById("cardContent").value;

  if (!cardContent.trim() && selectedImages.length === 0) return;

  // Mostrar um indicador de carregamento
  const submitBtn = document.querySelector("#createCardContainer .button");
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = "Publicando...";
  submitBtn.disabled = true;

  try {
    let imageUrls = [];

    // Se houver imagens selecionadas, fazer o upload delas
    if (selectedImages.length > 0) {
      try {
        // Extrair apenas os objetos File das imagens selecionadas
        const imageFiles = selectedImages.map((imgObj) => imgObj.file);

        // Upload múltiplo para o S3 via API
        if (imageFiles.length > 1) {
          imageUrls = await uploadMultipleImages(imageFiles);
        } else {
          // Upload único
          const url = await uploadImage(imageFiles[0]);
          imageUrls = [url];
        }
      } catch (uploadError) {
        console.error("Erro no upload das imagens:", uploadError);
      }
    }

    // Preparar dados para enviar à API
    const cardData = {
      content: cardContent,
      author: userName,
      medias: imageUrls,
    };

    // Enviar o card para a API
    const response = await api.post("/api/cards", cardData);

    // Formatar o novo card com a resposta da API
    const newCard = {
      id: response._id,
      content: response.content,
      medias: imageUrls,
      date: "Agora",
      author: userName,
    };

    // Adiciona o novo card no início da lista

    cards.unshift(newCard);
    document.getElementById("cardContent").value = "";
    selectedImages = [];
    renderPreviewGrid();

    // Atualiza a interface
    updateCards();

    // Exibe notificação de sucesso temporária
    showNotification("Card publicado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar card:", error);

    // Notifica o usuário sobre o erro
    showNotification(
      "Erro ao publicar o card. Tentando modo offline.",
      "error"
    );

    // Fallback para criação local caso a API falhe
    const newCard = {
      id: Date.now(),
      content: cardContent,
      medias: selectedImages.map((img) => img.url),
      date: "Agora",
      author: userName,
    };
    cards.unshift(newCard);
    document.getElementById("cardContent").value = "";
    selectedImages = [];
    renderPreviewGrid();
    updateCards();
  } finally {
    // Restaura o botão para o estado original
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
};

const imageUrl = (url) => {
  const apiUrl = window.appConfig
    ? window.appConfig.apiUrl
    : "http://localhost:3004";
  return `${apiUrl}/api/media?key=${url}`;
};

const updateCards = () => {
  const container = document.querySelector(".container2");
  container.innerHTML = "";

  if (cards.length === 0) {
    // Se não houver cards, mostrar mensagem
    const emptyMessage = document.createElement("div");
    emptyMessage.classList.add("card", "empty-message");
    emptyMessage.innerHTML = `
      <p>Ainda não há publicações.</p>
      ${
        userName
          ? "<p>Seja o primeiro a compartilhar algo!</p>"
          : "<p>Faça login para começar a compartilhar.</p>"
      }
    `;
    container.appendChild(emptyMessage);
    return;
  }

  // remove duplicates
  cards = cards.filter(
    (card, index, self) => index === self.findIndex((c) => c.id === card.id)
  );

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // Criar o cabeçalho do card com autor e data
    const headerDiv = document.createElement("div");
    headerDiv.className = "post-user";

    // Cria um wrapper para o header para incluir botão de lixeira para admins
    const headerWrapper = document.createElement("div");
    headerWrapper.className = "post-header-wrapper";
    headerWrapper.style.display = "flex";
    headerWrapper.style.justifyContent = "space-between";
    headerWrapper.style.alignItems = "center";
    headerWrapper.style.width = "100%";

    // Adiciona o texto de autor e data
    headerDiv.textContent = `${card.author ? card.author + " • " : ""}${
      card.date || ""
    }`;
    headerWrapper.appendChild(headerDiv);

    // Adiciona botão de lixeira se o usuário for admin
    if (admin === true || admin === "true") {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-card-btn";
      deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
      deleteButton.title = "Excluir este card";
      deleteButton.style.background = "transparent";
      deleteButton.style.border = "none";
      deleteButton.style.color = "#ff3b30";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.fontSize = "16px";
      deleteButton.style.padding = "4px 8px";
      deleteButton.style.borderRadius = "4px";
      deleteButton.onmouseover = function () {
        this.style.backgroundColor = "rgba(255, 59, 48, 0.1)";
      };
      deleteButton.onmouseout = function () {
        this.style.backgroundColor = "transparent";
      };

      // Adiciona evento de clique para excluir o card
      deleteButton.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Tem certeza que deseja excluir este card?")) {
          try {
            // Chamar API para deletar o card
            await api.delete(`/api/cards/${card.id}?auth=${authName}`);

            // Remove o card da lista local
            cards = cards.filter((c) => c.id !== card.id);

            // Atualiza a exibição
            updateCards();

            // Mostra notificação de sucesso
            showNotification("Card excluído com sucesso!");
          } catch (error) {
            console.error("Erro ao excluir card:", error);
            showNotification("Erro ao excluir card.", "error");
          }
        }
      });

      headerWrapper.appendChild(deleteButton);
    }

    // Criar o conteúdo do card
    const contentDiv = document.createElement("div");
    contentDiv.className = "post-content";
    contentDiv.textContent = card.content;

    // Adiciona os elementos ao card
    cardElement.appendChild(headerWrapper);
    cardElement.appendChild(contentDiv);

    // Se houver imagens, criar o grid de imagens
    if (card.medias && card.medias.length > 0) {
      const imageGrid = document.createElement("div");
      imageGrid.className = "card-image-grid";

      // Determinar o layout do grid com base na quantidade de imagens
      if (card.medias.length === 1) {
        imageGrid.style.gridTemplateColumns = "1fr";
      } else if (card.medias.length === 2) {
        imageGrid.style.gridTemplateColumns = "1fr 1fr";
      } else if (card.medias.length >= 3) {
        imageGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
      }

      // Adicionar cada imagem ao grid
      card.medias.forEach((url) => {
        const imgUrl = imageUrl(url);
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "image-wrapper";

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "Imagem do card";
        img.className = "card-img";
        img.loading = "lazy"; // Carregamento preguiçoso para melhor performance
        img.onerror = function () {
          // Tratar imagens quebradas
          this.src = "imgs/img-error.svg";
          this.style.opacity = "0.5";
          this.style.padding = "10px";
          this.error = true;
        };

        // Adicionar evento de clique para abrir em tela cheia
        img.onclick = function () {
          if (this.error) return;
          openFullscreen(imgUrl);
        };

        imgWrapper.appendChild(img);
        imageGrid.appendChild(imgWrapper);
      });

      cardElement.appendChild(imageGrid);
    }

    container.appendChild(cardElement);
  });
};

let currentCardImages = [];
let currentImageIndex = 0;

function openFullscreen(imgSrc) {
  // Encontrar o card que contém esta imagem
  const originalUrl = imgSrc.split("?key=")[1]; // Extrair a chave da URL

  // Encontrar o card correspondente à imagem clicada
  const currentCard = cards.find(
    (card) => card.medias && card.medias.some((media) => media === originalUrl)
  );

  if (currentCard && currentCard.medias && currentCard.medias.length > 0) {
    // Converter todas as URLs das medias para URLs completas
    currentCardImages = currentCard.medias.map((media) => imageUrl(media));
    currentImageIndex = currentCardImages.findIndex((url) => url === imgSrc);
  } else {
    // Fallback se não encontrar o card
    currentCardImages = [imgSrc];
    currentImageIndex = 0;
  }

  const modal = document.getElementById("fullscreenImageModal");
  const modalImg = document.getElementById("fullscreenImg");
  const counter = document.getElementById("imageCounter");
  // Adicionar classe de transição e configurar animação
  modalImg.classList.add("image-transition");
  modal.style.display = "block";

  // Pequeno delay antes de aplicar a opacidade para garantir transição suave
  setTimeout(() => {
    modal.classList.add("visible");
    modalImg.src = imgSrc;

    // Pequeno delay para garantir que a imagem carregue antes da animação
    setTimeout(() => {
      modalImg.classList.add("visible");
    }, 50);
  }, 10);

  counter.textContent = `${currentImageIndex + 1}/${currentCardImages.length}`;
  // Configurar navegação
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");

  prevBtn.onclick = showPreviousImage;
  nextBtn.onclick = showNextImage;

  // Ocultar botões se houver apenas uma imagem
  if (currentCardImages.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    counter.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
    counter.style.display = "block";
  }

  // Ocultar botões se houver apenas uma imagem
  if (currentCardImages.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    counter.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
    counter.style.display = "block";
  }
  const closeBtn = document.querySelector(".close-modal");
  closeBtn.onclick = function () {
    closeFullscreenModal(modal, modalImg);
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      closeFullscreenModal(modal, modalImg);
    }
  };

  // Adicionar navegação por teclado
  document.addEventListener("keydown", handleKeyNavigation);

  // Adicionar navegação por teclado
  document.addEventListener("keydown", handleKeyNavigation);
}

function showPreviousImage() {
  if (currentCardImages.length <= 1) return;

  // Adiciona classe de transição antes de mudar a imagem
  const modalImg = document.getElementById("fullscreenImg");
  modalImg.classList.add("image-exit");

  setTimeout(() => {
    currentImageIndex =
      (currentImageIndex - 1 + currentCardImages.length) %
      currentCardImages.length;
    updateFullscreenImage();

    // Remove a classe após um breve delay
    setTimeout(() => {
      modalImg.classList.remove("image-exit");
      modalImg.classList.add("image-enter");

      // Remove a classe de entrada após a animação
      setTimeout(() => {
        modalImg.classList.remove("image-enter");
      }, 300);
    }, 50);
  }, 150);
}

function showNextImage() {
  if (currentCardImages.length <= 1) return;

  // Adiciona classe de transição antes de mudar a imagem
  const modalImg = document.getElementById("fullscreenImg");
  modalImg.classList.add("image-exit");

  setTimeout(() => {
    currentImageIndex = (currentImageIndex + 1) % currentCardImages.length;
    updateFullscreenImage();

    // Remove a classe após um breve delay
    setTimeout(() => {
      modalImg.classList.remove("image-exit");
      modalImg.classList.add("image-enter");

      // Remove a classe de entrada após a animação
      setTimeout(() => {
        modalImg.classList.remove("image-enter");
      }, 300);
    }, 50);
  }, 150);
}

function updateFullscreenImage() {
  const modalImg = document.getElementById("fullscreenImg");
  const counter = document.getElementById("imageCounter");

  modalImg.src = currentCardImages[currentImageIndex];
  counter.textContent = `${currentImageIndex + 1}/${currentCardImages.length}`;
}

function handleKeyNavigation(e) {
  if (
    document.getElementById("fullscreenImageModal").style.display !== "block"
  ) {
    document.removeEventListener("keydown", handleKeyNavigation);
    return;
  }

  if (e.key === "ArrowLeft") {
    showPreviousImage();
    e.preventDefault(); // Previne o comportamento padrão de scroll
  } else if (e.key === "ArrowRight") {
    showNextImage();
    e.preventDefault(); // Previne o comportamento padrão de scroll  } else if (e.key === "Escape") {
    const modal = document.getElementById("fullscreenImageModal");
    const modalImg = document.getElementById("fullscreenImg");
    closeFullscreenModal(modal, modalImg);
  }
}

const imagePlaceholderBtn = document.getElementById("imagePlaceholderBtn");
if (imagePlaceholderBtn && cardImageInput) {
  imagePlaceholderBtn.addEventListener("click", () => {
    cardImageInput.click();
  });
}

// Função para mostrar notificações temporárias
function showNotification(message, type = "success") {
  // Verifica se já existe uma notificação e remove
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Cria elemento de notificação
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Adiciona ao DOM
  document.body.appendChild(notification);

  // Anima entrada
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";

    // Remove do DOM após a animação
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Adiciona funcionalidade ao botão de recarregar
const reloadBtn = document.getElementById("reloadBtn");
if (reloadBtn) {
  reloadBtn.addEventListener("click", async () => {
    reloadBtn.classList.add("loading");

    try {
      await loadCards();
      showNotification("Cards atualizados com sucesso!");
    } catch (error) {
      showNotification("Erro ao atualizar cards", "error");
    } finally {
      reloadBtn.classList.remove("loading");
    }
  });
}

// Nota: os cards serão carregados somente após verificação do nome do usuário
// O loadCards() agora é chamado no final da função checkUserName()

// Conectar ao WebSocket quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  // Conectar ao WebSocket
  wsManager.connect();
});
