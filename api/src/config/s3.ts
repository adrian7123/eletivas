import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuração do AWS S3
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'sua_access_key',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'sua_secret_key',
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.AWS_BUCKET_NAME || 'eletivas-app-images',
  endpoint: process.env.AWS_ENDPOINT, // Usado para MinIO
};

// Opções do S3
const s3Options: AWS.S3.ClientConfiguration = {
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
  region: s3Config.region,
};

// Adiciona endpoint personalizado para MinIO se fornecido
if (s3Config.endpoint) {
  s3Options.endpoint = s3Config.endpoint;
  s3Options.s3ForcePathStyle = process.env.AWS_FORCE_PATH_STYLE === 'true';
}

// Inicializa o cliente S3
const s3 = new AWS.S3(s3Options);

export { s3, s3Config };
