'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavoriteAction(movieId: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user?.id) {
    throw new Error('Não autorizado');
  }

  // Verifica se a assinatura permite favoritar (regra de acesso)
  // No caso, se chegou aqui, o Client já tentou barrar, mas vamos garantir no Server.
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() },
    },
  });

  if (!activeSub && user.role !== 'ADMIN') {
    throw new Error('Apenas assinantes podem salvar favoritos.');
  }

  // Checa se já é favorito
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  });

  if (existingFavorite) {
    // Remove dos favoritos
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    // Adiciona aos favoritos
    await prisma.favorite.create({
      data: {
        userId: user.id,
        movieId,
      },
    });
  }

  revalidatePath('/');
  revalidatePath('/catalog');
  revalidatePath('/favorites');
}
