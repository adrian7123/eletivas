import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';

export class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocket.Server;

  private constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  static getInstance(server?: HTTPServer): WebSocketService {
    if (!WebSocketService.instance && server) {
      WebSocketService.instance = new WebSocketService(server);
    }
    return WebSocketService.instance;
  }

  private init(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Cliente WebSocket conectado');

      ws.on('error', error => {
        console.error('Erro no WebSocket:', error);
      });

      ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
      });
    });
  }

  // Método para notificar todos os clientes sobre um novo card
  notifyCardCreated(card: any): void {
    if (this.wss.clients.size > 0) {
      console.log(`Notificando ${this.wss.clients.size} clientes sobre novo card`);

      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'NEW_CARD',
              data: card,
            }),
          );
        }
      });
    }
  }

  // Método para notificar todos os clientes sobre a exclusão de um card
  notifyCardDeleted(cardId: string): void {
    if (this.wss.clients.size > 0) {
      console.log(`Notificando ${this.wss.clients.size} clientes sobre exclusão de card`);

      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'DELETE_CARD',
              data: { id: cardId },
            }),
          );
        }
      });
    }
  }
}
