class Api {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Configura os cabeçalhos padrão
   * @param {Object} headers - Cabeçalhos a serem definidos
   */
  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Configura o token de autorização
   * @param {string} token - Token de autenticação
   */
  setAuthToken(token) {
    this.headers["Authorization"] = `Bearer ${token}`;
    return this;
  }

  /**
   * Método para realizar requisição GET
   * @param {string} endpoint - Endpoint da API
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} - Promessa com os dados da resposta
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Adiciona os parâmetros de consulta à URL
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição GET:", error);
      throw error;
    }
  }

  /**
   * Método para realizar requisição POST
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} - Promessa com os dados da resposta
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição POST:", error);
      throw error;
    }
  }

  /**
   * Método para realizar requisição PUT
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @returns {Promise} - Promessa com os dados da resposta
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      throw error;
    }
  }

  /**
   * Método para realizar requisição DELETE
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados opcionais a serem enviados
   * @returns {Promise} - Promessa com os dados da resposta
   */
  async delete(endpoint, data = null) {
    const options = {
      method: "DELETE",
      headers: this.headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      throw error;
    }
  }
}

// Exporta a classe para uso global
window.Api = Api;
