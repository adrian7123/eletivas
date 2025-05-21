// Configurações da aplicação
const appConfig = {
  // Ao rodar em produção, este valor será substituído pelo valor real
  // do ambiente de produção
  apiUrl: "http://localhost:3004",
  // apiUrl: "https://api.eletivas.gestaoeficiente.com",

  // Função para obter a configuração da API
  getApiConfig() {
    return {
      apiUrl: this.apiUrl,
    };
  },
};

// Verifica se estamos em um ambiente de navegador
if (typeof window !== "undefined") {
  window.appConfig = appConfig;
}
