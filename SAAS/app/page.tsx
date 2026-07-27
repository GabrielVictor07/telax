import { prisma } from '@/lib/prisma';
import { getMovies } from '@/lib/actions/movie';
import { getCategories } from '@/lib/actions/category';
import { checkUserAccess } from '@/lib/actions/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import HomeClient from './HomeClient';

export const revalidate = 60;

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  const [hasAccess, moviesData, categories, userFavorites] = await Promise.all([
    checkUserAccess(user?.id, user?.role),
    getMovies(),
    getCategories(),
    user?.id
      ? prisma.favorite.findMany({
          where: { userId: user.id },
          select: { movieId: true },
        }).catch(() => [])
      : Promise.resolve([]),
  ]);

  const favoriteIds = new Set(userFavorites.map((f: any) => f.movieId));
  
  const movies = moviesData.map((movie: any) => ({
    ...movie,
    isFavorite: favoriteIds.has(movie.id),
  }));

  return <HomeClient initialMovies={movies} categories={categories} hasAccess={hasAccess} />;
}
