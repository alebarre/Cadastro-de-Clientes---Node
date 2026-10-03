# Backend Cadastro de Clientes

API Node.js + TypeScript para cadastro de clientes, produtos e pedidos.
Inclui autenticação JWT com refresh token, roles, envio de código por e-mail para recuperação de senha, Prisma e Postgres via Docker.

## Tecnologias
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL (Docker)
- JWT (jsonwebtoken)
- Nodemailer (envio de e-mail)
- Swagger (swagger-jsdoc + swagger-ui-express)

## Requisitos
- Docker e Docker Compose
- Node.js 18+
- Yarn ou npm

## Configuração
1. Copie `.env.example` para `.env` e ajuste valores (DATABASE_URL, SMTP, JWT secrets).
2. Subir o Postgres:
   ```bash
   docker-compose up -d
