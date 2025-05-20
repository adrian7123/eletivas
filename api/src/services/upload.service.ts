import { v4 as uuidv4 } from 'uuid';
import { s3, s3Config } from '../config/s3';

interface MediaUploadResult {
  url: string;
  type: 'image' | 'audio' | 'video';
  mimeType: string;
}

export class UploadService {
  /**
   * Faz upload de uma mídia para o AWS S3
   * @param file - Arquivo a ser enviado
   * @returns Objeto com URL pública e informações do arquivo no S3
   */
  static async uploadMedia(file: Express.Multer.File): Promise<MediaUploadResult> {
    try {
      // Determina o tipo de mídia baseado no mimetype
      const mediaType = file.mimetype.split('/')[0] as 'image' | 'audio' | 'video';

      // Gera um nome único para o arquivo usando UUID
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Parâmetros para o upload no S3
      const params = {
        Bucket: s3Config.bucket,
        Key: `eletivas/${mediaType}/${Date.now()}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Upload do arquivo para o S3
      const uploadResult = await s3.upload(params).promise();

      // Retorna os detalhes da mídia
      return {
        url: uploadResult.Location,
        type: mediaType,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error('Erro ao fazer upload da mídia:', error);
      throw new Error('Falha ao fazer upload da mídia para o S3');
    }
  }
  /**
   * Faz upload de múltiplas mídias para o AWS S3
   * @param files - Array de arquivos a serem enviados
   * @returns Array de objetos com URLs públicas e informações dos arquivos no S3
   */
  static async uploadMultipleMedias(files: Express.Multer.File[]): Promise<MediaUploadResult[]> {
    try {
      // Upload de cada arquivo e coleta dos resultados
      const uploadPromises = files.map(file => this.uploadMedia(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Erro ao fazer upload das mídias:', error);
      throw new Error('Falha ao fazer upload das mídias para o S3');
    }
  }

  /**
   * Obtém a URL para visualização de uma mídia pelo seu identificador
   * @param mediaKey - Identificador da mídia no S3 ou caminho completo da URL
   * @returns URL pública da mídia
   */
  static getMediaUrl(mediaKey: string): string {
    // Verifica se já é uma URL completa (contém http/https)
    if (mediaKey.startsWith('http://') || mediaKey.startsWith('https://')) {
      return mediaKey;
    }

    // Se for apenas o nome do arquivo, construir a URL completa do S3
    if (!mediaKey.includes('/')) {
      mediaKey = `eletivas/${mediaKey}`;
    }

    // Constrói a URL do S3
    return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${mediaKey}`;
  }
}
