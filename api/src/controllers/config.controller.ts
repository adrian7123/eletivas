import { Request, Response } from 'express';

export class ConfigController {
  /**
   * Retorna as configurações do ambiente para o frontend
   */
  static getConfig(req: Request, res: Response): void {
    try {
      // Obtemos as configurações do ambiente
      const config = {
        // URL base da API
        apiUrl: process.env.API_URL || 'http://localhost:3004',

        // URL base para imagens
        imageUrlBase: process.env.IMAGE_URL_BASE || 'http://localhost:9000/eletivas',
      };

      res.status(200).json(config);
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      res.status(500).json({
        message: 'Erro ao obter configurações',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}
