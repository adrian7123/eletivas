# Eletivas App - Docker Setup

Este projeto está configurado para ser executado em contêineres Docker, facilitando a configuração do ambiente de desenvolvimento e produção.

## Requisitos

- Docker
- Docker Compose

## Iniciando com Docker

### Para iniciar todos os serviços:

```bash
docker-compose up -d
```

Isso irá iniciar os seguintes serviços:

- **MongoDB**: Banco de dados
- **MinIO**: Serviço compatível com S3 para armazenar imagens
- **API**: Backend em Node.js
- **Frontend**: Frontend servido pelo Nginx

### Para visualizar os logs:

```bash
docker-compose logs -f
```

### Para parar todos os serviços:

```bash
docker-compose down
```

### Para reconstruir os serviços após alterações:

```bash
docker-compose up -d --build
```

## Acessando os serviços

- **Frontend**: http://localhost
- **API**: http://localhost:3004
- **MinIO Console**: http://localhost:9001 (usuário: `minioadmin`, senha: `minioadmin`)
- **MongoDB**: mongodb://localhost:27017

## Volumes persistentes

Os dados do MongoDB e do MinIO são armazenados em volumes Docker para persistência mesmo após reiniciar os contêineres.

## Desenvolvimento

Para desenvolvimento, você pode modificar os arquivos localmente e:

1. Para o frontend: reconstrua a imagem com `docker-compose up -d --build frontend`
2. Para a API: reconstrua a imagem com `docker-compose up -d --build api`

## Variáveis de ambiente

As variáveis de ambiente estão configuradas no arquivo `docker-compose.yml`. Se precisar modificar alguma configuração, edite esse arquivo.
