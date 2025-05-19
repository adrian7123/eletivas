// Inicializa a API com a URL base
const api = new Api("http://localhost:3000");
let cards = [];

// Função para carregar cards da API
const loadCards = async () => {
  try {
    cards = await api.get("/api/cards");
    updateCards();
  } catch (error) {
    console.error("Erro ao carregar cards:", error);
    // Caso a API não esteja disponível, usar dados locais
    cards = [
      {
        date: "1h atrás",
        content: "Adorei a aula de hoje! #eletivas",
      },
      {
        date: "1h atrás",
        content: "Estamos preparando um projeto super legal! ✨",
      },
    ];
    updateCards();
  }
};

const updateCards = () => {
  const container = document.querySelector(".container2");

  container.innerHTML = "";

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    cardElement.innerHTML = `
                    <div class="post-user">${card.date}</div>
                    <div class="post-content">${card.content}</div>
                `;

    container.appendChild(cardElement);
  });
};

const createCard = async () => {
  const cardContent = document.getElementById("cardContent").value;

  if (!cardContent.trim()) return;

  try {
    // Enviar o card para a API
    const newCard = await api.post("/api/cards", { content: cardContent });

    // Adiciona o novo card no início da lista
    cards.unshift(newCard);

    // Limpa o campo de texto
    document.getElementById("cardContent").value = "";

    // Atualiza a interface
    updateCards();
  } catch (error) {
    console.error("Erro ao criar card:", error);

    // Fallback para criação local caso a API falhe
    const newCard = {
      id: Date.now(),
      date: "Agora",
      content: cardContent,
    };
    cards.unshift(newCard);
    document.getElementById("cardContent").value = "";
    updateCards();
  }
};

// Carrega os cards ao inicializar a página
loadCards();
