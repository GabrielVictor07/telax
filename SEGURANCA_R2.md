# Guia de Segurança e Rotação de Chaves - Cloudflare R2

Este documento estabelece as diretrizes de segurança para a gestão de tokens de acesso ao armazenamento **Cloudflare R2** no sistema **TELAX SaaS**.

---

## 🔒 1. Princípio do Menor Privilégio (Least Privilege)

Ao criar as credenciais de API no painel da Cloudflare para o R2:

1. Acesse o painel da **Cloudflare** > **R2** > **Manage R2 API Tokens**.
2. Clique em **Create API Token**.
3. **NÃO selecione** o papel `Admin Read & Write` global da conta.
4. Escolha **Object Read & Write** ou **Custom**.
5. No campo **Apply to specific buckets only**, selecione **APENAS o bucket `telax-media`**.
6. Defina um nome identificador claro para a VPS de produção (ex: `telax-prod-vps-r2`).

---

## 🔄 2. Procedimento de Rotação Segura de Chaves (Zero Downtime)

Caso uma chave seja comprometida ou por política de rotação periódica:

1. No painel da Cloudflare R2, clique em **Create API Token** para gerar um **novo par** de `Access Key ID` e `Secret Access Key`.
2. Acesse a VPS de produção e edite o arquivo `.env`:
   ```bash
   nano /caminho/do/projeto/SAAS/.env
   ```
3. Substitua os valores de `CLOUDFLARE_R2_ACCESS_KEY_ID` e `CLOUDFLARE_R2_SECRET_ACCESS_KEY` pelas novas credenciais.
4. Reinicie os containers da aplicação:
   ```bash
   docker compose restart telax_app
   ```
5. Valide o upload de mídias e a reprodução de vídeos no site.
6. Após confirmar o funcionamento, volte ao painel da Cloudflare e **delete/revogue o token antigo**.
