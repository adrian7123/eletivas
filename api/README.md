# API Express com TypeScript

API simples construída com Express e TypeScript para o projeto Eletivas.

## Requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install
```

## Scripts disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build`: Compila o código TypeScript para JavaScript
- `npm start`: Inicia o servidor em modo de produção (requer compilação prévia)

## Rotas da API

- `GET /api`: Retorna uma mensagem de status da API
- `GET /api/cards`: Retorna a lista de cards
- `POST /api/cards`: Cria um novo card (requer corpo JSON com `content`)

## Estrutura do projeto

```
api/
├── src/               # Código fonte
│   └── index.ts       # Arquivo principal
├── dist/              # Código compilado (gerado pelo TypeScript)
├── package.json       # Dependências e scripts
└── tsconfig.json      # Configuração do TypeScript
```
