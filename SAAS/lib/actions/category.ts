'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCachedData, redis } from '@/lib/redis';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Acesso negado. Permissão de administrador necessária.');
  }
  return user;
}

export async function getCategories() {
  return getCachedData('categories_all', async () => {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { movies: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }, 60 * 60); // 1 hour cache
}

import { categorySchema } from '@/lib/validators';

export async function createCategory(name: string, slug: string) {
  await requireAdmin();
  const validated = categorySchema.parse({ name, slug });
  
  await prisma.category.create({
    data: validated,
  });
  
  await redis.del('categories_all');
  revalidatePath('/admin/categories');
}

export async function updateCategory(id: string, name: string, slug: string) {
  await requireAdmin();
  if (!id) throw new Error('ID inválido');
  const validated = categorySchema.parse({ name, slug });

  await prisma.category.update({
    where: { id },
    data: validated,
  });

  await redis.del('categories_all');
  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  if (!id) throw new Error('ID inválido');

  await prisma.category.delete({
    where: { id },
  });

  await redis.del('categories_all');
  revalidatePath('/admin/categories');
}
