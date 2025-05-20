import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class UploadController {
  /**
   * Controlador para upload de uma única mídia
   */
  static async uploadMedia(req: Request, res: Response): Promise<any> {
    try {
      // Verifica se existe arquivo na requisição
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhuma mídia enviada' });
      }

      // Determina o tipo de mídia baseado no mimetype
      const mediaType = req.file.mimetype.split('/')[0]; // image, audio, ou video
      if (!['image', 'audio', 'video'].includes(mediaType)) {
        return res.status(400).json({ message: 'Tipo de mídia não suportado' });
      }

      // Faz upload da mídia usando o serviço
      const { url, type, mimeType } = await UploadService.uploadMedia(req.file);

      // Retorna os detalhes da mídia
      return res.status(200).json({ url, type, mimeType });
    } catch (error) {
      console.error('Erro no controller de upload:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload da mídia' });
    }
  }
  /**
   * Controlador para upload de múltiplas mídias
   */
  static async uploadMultipleMedias(req: Request, res: Response): Promise<any> {
    try {
      // Verifica se existem arquivos na requisição
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'Nenhuma mídia enviada' });
      }

      // Faz upload das mídias usando o serviço
      const mediaResults = await UploadService.uploadMultipleMedias(
        req.files as Express.Multer.File[],
      );

      // Retorna os detalhes das mídias
      return res.status(200).json({ medias: mediaResults });
    } catch (error) {
      console.error('Erro no controller de upload múltiplo:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload das mídias' });
    }
  }

  /**
   * Controlador para visualização de mídia
   * Redireciona para a URL da mídia armazenada no S3
   */
  static async getMedia(req: Request, res: Response): Promise<any> {
    try {
      const { mediaKey } = req.params;

      if (!mediaKey) {
        return res.status(400).json({ message: 'Identificador da mídia não fornecido' });
      }

      // Obtém a URL da mídia usando o serviço
      const mediaUrl = UploadService.getMediaUrl(mediaKey);

      // Redireciona para a URL da mídia no S3
      return res.redirect(mediaUrl);
    } catch (error) {
      console.error('Erro ao obter mídia:', error);
      return res.status(500).json({ message: 'Erro ao obter a mídia' });
    }
  }
}
