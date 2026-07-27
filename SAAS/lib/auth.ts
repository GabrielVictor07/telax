import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getJwtSecret } from '@/lib/auth-config';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        securityKey: { label: 'Chave de Segurança', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Preencha e-mail e senha.');
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;
        const inputSecurityKey = (credentials as any)?.securityKey;

        // Se o ADMIN_MASTER_KEY estiver configurado e o usuário forneceu chave de segurança no login
        const expectedMasterKey = process.env.ADMIN_MASTER_KEY;
        if (expectedMasterKey && inputSecurityKey) {
          if (inputSecurityKey !== expectedMasterKey) {
            throw new Error('Chave mestre de segurança incorreta.');
          }
        }

        const isDevMode = process.env.NODE_ENV === 'development';
        const allowDevCredentials = isDevMode && process.env.ALLOW_DEV_CREDENTIALS === 'true';

        // 1. CREDENCIAIS TEMPORÁRIAS DE TESTE (SOMENTE SE EM DEV E ALLOW_DEV_CREDENTIALS HABILITADO)
        if (allowDevCredentials) {
          if (inputEmail === 'admin@telax.com' && inputPassword === 'admin123') {
            return {
              id: 'usr_admin_temp_01',
              name: 'Gabriel Motta (Admin)',
              email: 'admin@telax.com',
              role: 'ADMIN',
            };
          }

          if (inputEmail === 'user@telax.com' && inputPassword === 'user123') {
            return {
              id: 'usr_client_temp_01',
              name: 'Cliente VIP Teste',
              email: 'user@telax.com',
              role: 'USER',
            };
          }
        }

        // 2. CONSULTA NO BANCO DE DADOS POSTGRESQL (OBRIGATÓRIO EM PRODUÇÃO)
        try {
          const user = await prisma.user.findUnique({
            where: { email: inputEmail },
          });

          if (user) {
            const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch {
          console.warn('[Auth Warning] Erro de consulta no Prisma.');
        }

        throw new Error('E-mail ou senha incorretos.');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  cookies: process.env.COOKIE_DOMAIN
    ? {
        sessionToken: {
          name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            domain: process.env.COOKIE_DOMAIN,
          },
        },
      }
    : undefined,
  secret: getJwtSecret(),
};
