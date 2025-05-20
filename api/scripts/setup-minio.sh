#!/bin/sh
# Script para configurar o MinIO quando o contêiner for iniciado
# Cria o bucket se não existir

echo "Configurando o MinIO..."
sleep 10  # Aguarda o MinIO iniciar completamente

# Configura o cliente MinIO
mc config host add myminio http://minio:9000 minioadmin minioadmin

# Cria o bucket se não existir
mc mb --ignore-existing myminio/eletivas-app-images

# Configura políticas de acesso público para o bucket (opcional)
mc policy set download myminio/eletivas-app-images

echo "Configuração do MinIO concluída!"
