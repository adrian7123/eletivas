// Classe para gerenciar conexões WebSocket
class WebSocketManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 segundos
    this.callbacks = {
      onNewCard: () => {},
      onCardDeleted: () => {},
      onConnect: () => {},
      onDisconnect: () => {},
    };
  }

  // Inicializar a conexão WebSocket
  connect() {
    // Criar URL WebSocket a partir da URL da API (convertendo http para ws)
    const wsUrl = this.apiUrl.replace(/^http/, "ws");

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("Conexão WebSocket estabelecida");
        this.reconnectAttempts = 0;
        this.callbacks.onConnect();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Erro ao processar mensagem WebSocket:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("Conexão WebSocket fechada. Código:", event.code);
        this.callbacks.onDisconnect();

        // Tentar reconectar se não foi um fechamento limpo
        if (!event.wasClean) {
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error("Erro na conexão WebSocket:", error);
      };
    } catch (error) {
      console.error("Falha ao inicializar WebSocket:", error);
    }
  }

  // Tentar reconectar ao servidor
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${this.reconnectDelay}ms`
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.log("Número máximo de tentativas de reconexão atingido.");
    }
  }

  // Processar mensagens recebidas
  handleMessage(message) {
    switch (message.type) {
      case "NEW_CARD":
        console.log("Novo card recebido:", message.data);
        this.callbacks.onNewCard(message.data);
        break;

      case "DELETE_CARD":
        console.log("Card excluído:", message.data);
        this.callbacks.onCardDeleted(message.data.id);
        break;

      default:
        console.log("Mensagem desconhecida recebida:", message);
    }
  }

  // Encerrar conexão
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Registrar callbacks para diferentes eventos
  onNewCard(callback) {
    this.callbacks.onNewCard = callback;
  }

  onCardDeleted(callback) {
    this.callbacks.onCardDeleted = callback;
  }

  onConnect(callback) {
    this.callbacks.onConnect = callback;
  }

  onDisconnect(callback) {
    this.callbacks.onDisconnect = callback;
  }
}

// Exportar para uso global
window.WebSocketManager = WebSocketManager;
