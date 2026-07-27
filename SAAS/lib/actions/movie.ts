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

export async function getMovies() {
  try {
    return await getCachedData('movies_all', async () => {
      return prisma.movie.findMany({
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }, 60 * 5); // 5 minutes cache
  } catch (error) {
    console.warn('[Prisma Warning] Banco de dados indisponível no servidor.');
    return [];
  }
}

import { movieSchema } from '@/lib/validators';

export async function createMovie(data: {
  title: string;
  description: string;
  year: number;
  rating: number;
  duration: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  isFeatured: boolean;
  categoryId: string;
}) {
  await requireAdmin();
  const validatedData = movieSchema.parse(data);

  if (validatedData.isFeatured) {
    // Apenas um destaque
    await prisma.movie.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
  }

  await prisma.movie.create({
    data: validatedData,
  });

  await redis.del('movies_all');
  revalidatePath('/admin');
  revalidatePath('/catalog');
  revalidatePath('/');
}

export async function updateMovie(id: string, data: {
  title: string;
  description: string;
  year: number;
  rating: number;
  duration: string;
  posterUrl: string;
  bannerUrl: string;
  videoUrl: string;
  isFeatured: boolean;
  categoryId: string;
}) {
  await requireAdmin();

  if (!id) throw new Error('ID do filme inválido');
  const validatedData = movieSchema.parse(data);

  if (validatedData.isFeatured) {
    await prisma.movie.updateMany({
      where: { isFeatured: true, NOT: { id } },
      data: { isFeatured: false },
    });
  }

  const updated = await prisma.movie.update({
    where: { id },
    data: validatedData,
  });

  await redis.del('movies_all');
  revalidatePath('/admin');
  revalidatePath('/catalog');
  revalidatePath('/');

  return updated;
}

export async function deleteMovie(id: string) {
  await requireAdmin();

  await prisma.movie.delete({
    where: { id },
  });

  await redis.del('movies_all');
  revalidatePath('/admin');
  revalidatePath('/catalog');
  revalidatePath('/');
}

export async function setFeaturedMovie(id: string) {
  await requireAdmin();

  await prisma.movie.updateMany({
    where: { isFeatured: true },
    data: { isFeatured: false },
  });

  await prisma.movie.update({
    where: { id },
    data: { isFeatured: true },
  });

  await redis.del('movies_all');
  revalidatePath('/admin');
  revalidatePath('/');
}
