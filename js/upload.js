// Funcionalidade de upload de imagens no frontend

// Função para fazer upload de uma única imagem
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("media", file);
  try {
    // Mostra notificação de processamento
    showNotification("Enviando imagem...", "info");

    const uploadUrl = window.appConfig
      ? `${window.appConfig.apiUrl}/api/upload`
      : "http://localhost:3004/api/upload";

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro ao fazer upload da imagem: ${response.status}`);
    }

    const result = await response.json();
    return result; // URL da imagem no S3
  } catch (error) {
    console.error("Erro no upload:", error);
    showNotification("Erro ao enviar imagem. Tente novamente.", "error");
    throw error;
  }
}

// Função para fazer upload de múltiplas imagens
async function uploadMultipleImages(files) {
  const formData = new FormData();

  // Adiciona cada arquivo ao FormData
  for (let i = 0; i < files.length; i++) {
    formData.append("medias", files[i]);
  }

  try {
    // Mostra notificação de processamento com contagem de arquivos
    showNotification(`Enviando ${files.length} imagens...`, "info");

    const response = await fetch(
      `${window.appConfig.apiUrl}/api/upload/multiple`,
      {
        method: "POST",
        body: formData,
        // Não definimos timeout para permitir uploads grandes
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao fazer upload das imagens: ${response.status}`);
    }

    const result = await response.json();
    showNotification(
      `${files.length} imagens enviadas com sucesso!`,
      "success"
    );
    return result; // Array de URLs das imagens no S3
  } catch (error) {
    console.error("Erro no upload múltiplo:", error);
    showNotification("Erro ao enviar imagens. Tentando modo offline.", "error");
    throw error;
  }
}
