// Configurações da aplicação
const appConfig = {
  // Ao rodar em produção, este valor será substituído pelo valor real
  // do ambiente de produção
  apiUrl: process.env.API_URL || "http://localhost:3000",

  // Outras configurações que podem vir de variáveis de ambiente
  imageUrlBase: process.env.IMAGE_URL_BASE || "http://localhost:9000/eletivas",

  // Função para obter a configuração da API
  getApiConfig() {
    return {
      apiUrl: this.apiUrl,
      imageUrlBase: this.imageUrlBase,
    };
  },
};

// Verifica se estamos em um ambiente de navegador
if (typeof window !== "undefined") {
  window.appConfig = appConfig;

  // Função para carregar configurações da API se disponíveis
  async function loadServerConfig() {
    try {
      const response = await fetch(`${appConfig.apiUrl}/config`);

      if (response.ok) {
        const serverConfig = await response.json();

        // Atualiza as configurações com valores do servidor
        Object.assign(appConfig, serverConfig);

        console.log("Configurações carregadas do servidor:", appConfig);
      }
    } catch (error) {
      console.warn(
        "Não foi possível carregar configurações do servidor, usando valores padrão:",
        error
      );
    }
  }

  // Carrega configurações quando o documento estiver pronto
  document.addEventListener("DOMContentLoaded", loadServerConfig);
}
