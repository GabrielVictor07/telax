import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getJwtSecret } from '@/lib/auth-config';

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Detecta se a requisição veio do subdomínio de Admin (ex: admin.telax.com)
  const isSubdomainAdmin = host.startsWith('admin.') || host.includes('admin-server');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isAdminRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    isSubdomainAdmin;

  // Lê o token JWT do cookie (funciona no Edge sem acesso ao DB)
  const token = await getToken({
    req,
    secret: getJwtSecret(),
  });

  // 1. ROTEAMENTO DE SERVIDOR DEDICADO DE ADMIN
  if (isSubdomainAdmin) {
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  } else if (pathname.startsWith('/admin') && process.env.NEXT_PUBLIC_ADMIN_URL) {
    // Redireciona /admin para o servidor dedicado de admin, se configurado
    const adminServerUrl = new URL(pathname, process.env.NEXT_PUBLIC_ADMIN_URL);
    adminServerUrl.search = url.search;
    return NextResponse.redirect(adminServerUrl);
  }

  // 2. PROTEÇÃO DAS ROTAS ADMIN
  if (isAdminRoute && !isAdminLoginRoute) {
    if ((token as any)?.role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Acesso negado. Servidor restrito a administradores.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    // Exclui rotas do NextAuth, assets estáticos e favicon
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
