import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AccessDenied from '@/components/AccessDenied';
import FavoritesClient from './FavoritesClient';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex min-h-screen bg-[#08090c]">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
          <Header />
          <AccessDenied message="Crie uma conta para salvar seus filmes favoritos." />
        </div>
      </div>
    );
  }

  const user = session.user as any;

  // Busca se o usuário tem assinatura ativa para exibir o conteúdo
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() },
    },
  });

  const hasAccess = !!activeSub || user.role === 'ADMIN';

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen bg-[#08090c]">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
          <Header />
          <AccessDenied message="Apenas contas Premium podem salvar títulos nos Favoritos. Assine para montar sua lista." />
        </div>
      </div>
    );
  }

  // Busca os filmes favoritos do banco
  const userFavorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      movie: {
        include: { category: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const favoriteMovies = userFavorites.map(f => ({
    ...f.movie,
    isFavorite: true
  }));

  return <FavoritesClient initialMovies={favoriteMovies} hasAccess={hasAccess} />;
}
