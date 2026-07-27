import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        authenticated: false,
        hasAccess: false,
        status: 'UNAUTHENTICATED',
      });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userEmail = session.user.email;

    // Administradores sempre possuem acesso
    if (userRole === 'ADMIN') {
      return NextResponse.json({
        authenticated: true,
        hasAccess: true,
        status: 'ACTIVE',
        plan: 'PLATINUM',
        role: 'ADMIN',
      });
    }

    // Dev mode fallback
    const isDevMode = process.env.NODE_ENV === 'development';
    if (isDevMode && (userEmail === 'user@telax.com' || userId === 'usr_client_temp_01')) {
      return NextResponse.json({
        authenticated: true,
        hasAccess: true,
        status: 'ACTIVE',
        plan: 'PLATINUM',
      });
    }

    // Busca assinatura ativa no banco de dados
    const orConditions: any[] = [];
    if (userId) orConditions.push({ userId });
    if (userEmail) orConditions.push({ user: { email: userEmail } });

    const activeSub = await prisma.subscription.findFirst({
      where: {
        ...(orConditions.length > 0 ? { OR: orConditions } : {}),
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (activeSub) {
      return NextResponse.json({
        authenticated: true,
        hasAccess: true,
        status: activeSub.status,
        plan: activeSub.plan,
        expiresAt: activeSub.expiresAt.toISOString(),
      });
    }

    return NextResponse.json({
      authenticated: true,
      hasAccess: false,
      status: 'NONE',
      plan: null,
    });
  } catch (error) {
    console.error('[TELAX API Status] Erro ao consultar status da assinatura:', error);
    return NextResponse.json({ error: 'Erro interno ao consultar status.' }, { status: 500 });
  }
}
