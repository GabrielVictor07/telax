# 🚀 Guia de Deploy em VPS Linux - TELAX SaaS

Este documento contém o passo a passo completo para realizar o deploy em produção da aplicação **TELAX SaaS** em qualquer servidor VPS Linux (Ubuntu 22.04 / 24.04 LTS em Hostinger, Contabo, Hetzner, DigitalOcean, AWS, etc.).

---

## 📋 Pré-requisitos na VPS Linux

1. **Acesso SSH ao Servidor** com usuário `root` ou permissões de `sudo`.
210. **Domínio Apontado:** Apontar o registro de DNS do seu domínio (`tellax.online`, `www.tellax.online` e `admin.tellax.online`) para o endereço IP da sua VPS.

---

## 🛠️ Passo 1: Instalar o Docker e Git na VPS

Conecte-se à sua VPS via SSH e rode os comandos abaixo:

```bash
# Atualizar repositórios do sistema
sudo apt update && sudo apt upgrade -y

# Instalar Git, Curl e utilitários
sudo apt install -y git curl ufw

# Instalar o Docker e Docker Compose
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker

# Verificar instalação
docker --version
docker compose version
```

---

## 📂 Passo 2: Clonar o Repositório do TELAX

```bash
# Clonar o repositório no servidor
git clone https://github.com/seu-usuario/telax.git /opt/telax

# Acessar a pasta da infraestrutura
cd /opt/telax/docker
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente de Produção

Crie/edite o arquivo `.env` na pasta `/opt/telax/SAAS/.env`:

```bash
nano /opt/telax/SAAS/.env
```

Preencha com as credenciais reais de produção:

```env
# Configurações do App (Cliente)
NEXTAUTH_URL=https://tellax.online
# DICA: Gerar chave aleatória via terminal: openssl rand -base64 32
NEXTAUTH_SECRET=sua_chave_criptografica_de_64_caracteres_gerada_aqui

# Separação de Servidores / Subdomínios (Admin vs Cliente)
NEXT_PUBLIC_ADMIN_URL=https://admin.tellax.online
COOKIE_DOMAIN=.tellax.online

# Banco de Dados PostgreSQL & Redis (Geridos pelo Docker)
POSTGRES_USER=telax_user
POSTGRES_PASSWORD=sua_senha_forte_do_postgres_aqui
POSTGRES_DB=telax_db
DATABASE_URL="postgresql://telax_user:sua_senha_forte_do_postgres_aqui@postgres:5432/telax_db?schema=public"
REDIS_URL="redis://redis:6379"

# Armazenamento em Nuvem - Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=sua_account_id_real
CLOUDFLARE_R2_ACCESS_KEY_ID=sua_access_key_real
CLOUDFLARE_R2_SECRET_ACCESS_KEY=sua_secret_key_real
CLOUDFLARE_R2_BUCKET_NAME=telax-media
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxxx.r2.dev

# Pagamentos - Webhook & Segurança
CAKTO_WEBHOOK_TOKEN=sua_chave_secreta_do_webhook
ADMIN_MASTER_KEY=TELAX_SECURE_ADMIN_2026
ALLOW_DEV_CREDENTIALS=false
```

---

## 🏗️ Passo 4: Subir os Containers com Docker Compose

Na pasta `/opt/telax/docker`, rode o comando para compilar e subir todos os serviços (PostgreSQL, Redis, Next.js App e Nginx):

```bash
cd /opt/telax/docker
docker compose up -d --build
```

### Popular o Banco de Dados com Seed Inicial:

```bash
docker exec -it telax_app npx prisma db push
docker exec -it telax_app npx prisma db seed
```

---

## 🔒 Passo 5: Gerar Certificado SSL Gratuito (HTTPS com Certbot)

Para ativar a navegação segura com cadeado verde (HTTPS), instale o Certbot na VPS:

```bash
# Instalar Certbot
sudo apt install -y certbot

# Gerar certificado SSL para o domínio tellax.online e subdomínio admin.tellax.online
sudo certbot certonly --webroot -w /var/lib/docker/volumes/docker_certbot_data/_data -d tellax.online -d www.tellax.online -d admin.tellax.online

# Reiniciar o Nginx para carregar os certificados SSL
docker compose restart nginx
```

---

## 🎮 Comandos Úteis de Gerenciamento

```bash
# Ver status de todos os containers
docker ps

# Ver logs da aplicação Next.js em tempo real
docker logs -f telax_app

# Ver logs do Nginx
docker logs -f telax_nginx

# Reiniciar todos os serviços
docker compose restart

# Atualizar a aplicação após um git pull
git pull origin main
docker compose up -d --build
```

---

### 🎉 Pronto!
Sua aplicação TELAX estará rodando em produção com alta disponibilidade, banco PostgreSQL, cache Redis, armazenamento em nuvem no Cloudflare R2 e pagamentos PIX no Mercado Pago.
