import { getMovies } from '@/lib/actions/movie';
import { getCategories } from '@/lib/actions/category';
import { checkUserAccess } from '@/lib/actions/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CatalogClient from './CatalogClient';

export const revalidate = 60;

export default async function CatalogPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const hasAccess = await checkUserAccess(user?.id, user?.role);

  let movies = await getMovies();
  const categories = await getCategories();

  // Se logado, busca favoritos para mapear na UI
  if (user?.id) {
    const { prisma } = await import('@/lib/prisma');
    const userFavorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { movieId: true },
    });
    
    const favoriteIds = new Set(userFavorites.map(f => f.movieId));
    
    movies = movies.map(movie => ({
      ...movie,
      isFavorite: favoriteIds.has(movie.id),
    }));
  }

  return <CatalogClient initialMovies={movies} categories={categories} hasAccess={hasAccess} />;
}
