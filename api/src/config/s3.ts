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
};

// Inicializa o cliente S3
const s3 = new AWS.S3({
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
  region: s3Config.region,
});

export { s3, s3Config };
