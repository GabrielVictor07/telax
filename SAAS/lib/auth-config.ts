export function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'ERRO CRÍTICO DE SEGURANÇA: A variável de ambiente NEXTAUTH_SECRET não está definida no ambiente de produção.'
      );
    }
    return 'telax_dev_only_jwt_secret_key_change_in_env';
  }

  return secret;
}
