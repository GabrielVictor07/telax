'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Acesso negado. Permissão de administrador necessária.');
  }
  return user;
}

export async function checkUserAccess(userId?: string, role?: string) {
  if (role === 'ADMIN') return true;
  if (!userId) return false;

  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() },
    },
  });

  return !!activeSub;
}

export async function getUsers() {
  await requireAdmin();

  return prisma.user.findMany({
    include: {
      subscriptions: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteUser(id: string) {
  await requireAdmin();

  if (!id) throw new Error('ID inválido');

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/admin/users');
}
