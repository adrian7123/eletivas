import { Request, Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { s3, s3Config } from '../config/s3';
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
      const { url } = await UploadService.uploadMedia(req.file);

      // Retorna os detalhes da mídia
      return res.status(200).json(url);
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
      return res.status(200).json(mediaResults.map(media => media.url));
    } catch (error) {
      console.error('Erro no controller de upload múltiplo:', error);
      return res.status(500).json({ message: 'Erro ao fazer upload das mídias' });
    }
  }

  /**
    Pega media do s3 e retorna o arquivo
    baseado na url
   */
  static async getMedia(req: Request, res: Response): Promise<any> {
    try {
      const { key } = req.query;

      if (!key) {
        return res.status(400).json({ message: 'Identificador da mídia não fornecido' });
      }

      const mediaKey = key as string;

      const urlSplit = mediaKey.split('/');
      const fileName = urlSplit[urlSplit.length - 1];

      // remove filename
      urlSplit.pop();
      // remove https://s3-bucket
      urlSplit.splice(0, 3);

      const params = {
        Key: urlSplit.join('/') + `/${fileName}`,
        Bucket: s3Config.bucket,
      };

      const data = await s3.getObject(params).promise();

      // Cria um diretório temporário para o arquivo
      const tmpDir = os.tmpdir();
      const tmpFilePath = path.join(tmpDir, fileName);

      // Salva o arquivo temporariamente
      fs.writeFileSync(tmpFilePath, data.Body as Buffer);

      // Configura limpeza após enviar o arquivo
      res.on('finish', () => {
        try {
          fs.unlinkSync(tmpFilePath);
        } catch (err) {
          console.error('Erro ao remover arquivo temporário:', err);
        }
      });

      return res.status(200).sendFile(tmpFilePath);
    } catch (error) {
      console.error('Erro ao obter mídia:', error);
      return res.status(500).json({ message: 'Erro ao obter a mídia' });
    }
  }
}
