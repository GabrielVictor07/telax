'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function cancelSubscription(subscriptionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Não autenticado.');

  const user = session.user as any;

  // Verifica se a assinatura pertence ao usuário
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) throw new Error('Assinatura não encontrada.');
  if (subscription.userId !== user.id && user.role !== 'ADMIN') {
    throw new Error('Sem permissão para cancelar esta assinatura.');
  }

  if (subscription.status === 'CANCELED') {
    throw new Error('Esta assinatura já foi cancelada.');
  }

  // Cancela a assinatura no banco
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'CANCELED' },
  });

  revalidatePath('/profile');
  return { success: true };
}

export async function getSubscriptionHistory(userId: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user) {
    throw new Error('Não autenticado.');
  }

  if (user.id !== userId && user.role !== 'ADMIN') {
    throw new Error('Sem permissão para acessar este histórico.');
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return subscriptions.map(sub => ({
    id: sub.id,
    plan: sub.plan,
    status: sub.status,
    expiresAt: sub.expiresAt.toISOString(),
    createdAt: sub.createdAt.toISOString(),
    paymentGatewayId: sub.paymentGatewayId,
  }));
}
