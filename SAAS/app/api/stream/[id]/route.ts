import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSignedStreamUrl } from '@/lib/r2';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Autenticação necessária para reproduzir filmes.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const userEmail = session.user.email;

    // 1. Administradores possuem acesso irrestrito ao streaming
    if (userRole !== 'ADMIN') {
      let hasActiveSubscription = false;
      const isDevMode = process.env.NODE_ENV === 'development';
      const allowDevCredentials = isDevMode && process.env.ALLOW_DEV_CREDENTIALS === 'true';

      // Fallback para usuário de teste apenas em ambiente de desenvolvimento com flag explícita habilitada
      if (allowDevCredentials && (userEmail === 'user@telax.com' || userId === 'usr_client_temp_01')) {
        hasActiveSubscription = true;
      } else {
        try {
          const orConditions: any[] = [];
          if (userId) orConditions.push({ userId });
          if (userEmail) orConditions.push({ user: { email: userEmail } });

          const activeSub = await prisma.subscription.findFirst({
            where: {
              ...(orConditions.length > 0 ? { OR: orConditions } : {}),
              status: 'ACTIVE',
              expiresAt: {
                gt: new Date(),
              },
            },
          });

          if (activeSub) {
            hasActiveSubscription = true;
          }
        } catch (dbError) {
          console.error('Erro ao verificar assinatura no banco:', dbError);
        }
      }

      if (!hasActiveSubscription) {
        return NextResponse.json(
          { error: 'Assinatura necessária. Assine um plano para ter acesso a este conteúdo.' },
          { status: 403 }
        );
      }
    }

    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Filme não encontrado.' }, { status: 404 });
    }

    // Gerar Signed URL temporária (expira em 3 horas)
    const streamUrl = await generateSignedStreamUrl(movie.videoUrl, 10800);

    return NextResponse.json({
      title: movie.title,
      streamUrl,
      expiresIn: '3 horas',
    });
  } catch (error) {
    console.error('Erro ao gerar Signed URL:', error);
    return NextResponse.json({ error: 'Erro no streaming seguro.' }, { status: 500 });
  }
}
