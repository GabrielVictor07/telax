# Credenciais de Teste - TELAX

Como o banco de dados principal pode não estar online no momento (ou não populado), você pode utilizar as seguintes contas temporárias que foram criadas diretamente no código para facilitar seus testes em diferentes áreas da aplicação (Dashboard vs Admin):

## 🛡️ Conta de Administrador
Permite o acesso à área corporativa/gestão do SaaS (`http://admin.localhost:3000` ou `/admin`).

- **E-mail:** `admin@telax.com`
- **Senha:** `admin123`
- **Chave Mestre de Segurança (Opcional/Configurada):** `TELAX_SECURE_ADMIN_2026`
- **Permissão:** `ADMIN`

## 👤 Conta de Usuário (Cliente VIP)
Permite o acesso à área de usuário padrão (Streaming de Vídeos, Perfil, etc) via `http://localhost:3000`.

- **E-mail:** `user@telax.com`
- **Senha:** `user123`
- **Permissão:** `USER`

---
> **Nota de Segurança:** As credenciais estáticas acima funcionam **exclusivamente em ambiente de desenvolvimento local (`NODE_ENV === 'development'`)**. Em ambiente de produção, este bypass é automaticamente desativado pelo sistema de autenticação, sendo obrigatório o uso do banco de dados PostgreSQL.
