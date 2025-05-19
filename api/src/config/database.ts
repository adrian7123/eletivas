import dotenv from "dotenv";
import mongoose from "mongoose";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// URI do MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eletivas_db";

// Opções de conexão do Mongoose
const options = {
  autoIndex: true, // Constrói índices
  maxPoolSize: 10, // Manter até 10 conexões de socket
  serverSelectionTimeoutMS: 5000, // Tempo limite antes de falhar a conexão
  socketTimeoutMS: 45000, // Tempo limite para operações do socket
  family: 4, // Use IPv4, pule tentativa de IPv6
};

// Função para conectar ao MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
  } catch (error) {
    console.error("Erro na conexão com o MongoDB:", error);
    process.exit(1);
  }
};

// Manipulação de eventos de conexão do Mongoose
mongoose.connection.on("error", (err) => {
  console.error(`Erro de conexão MongoDB: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB desconectado");
});

// Manipular o encerramento da aplicação
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log(
    "Conexão com MongoDB fechada devido ao encerramento da aplicação"
  );
  process.exit(0);
});
