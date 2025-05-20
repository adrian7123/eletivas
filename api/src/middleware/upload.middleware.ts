import multer from 'multer';

// Configuração para armazenar os arquivos na memória antes de enviar ao S3
const storage = multer.memoryStorage();

// Filtra os tipos de arquivos permitidos (imagens, áudio e vídeo)
const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  const allowedMimeTypes = [
    // Imagens
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Áudio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    // Vídeo
    'video/mp4',
    'video/webm',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error('Tipo de arquivo não suportado. Apenas imagens, áudios e vídeos são permitidos.'),
      false,
    );
  }
};

// Configuração do multer para upload único
export const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limite de 50MB para acomodar vídeos
  },
}).single('media');

// Configuração do multer para upload múltiplo
export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limite de 50MB por arquivo
  },
}).array('medias', 10); // Máximo de 10 arquivos por vez
