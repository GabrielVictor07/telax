import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do TELAX...');

  // 1. Criar Usuários
  const adminEmail = 'admin@telax.com';
  const userEmail = 'user@telax.com';

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Gabriel Motta (Admin)',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const client = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: 'Cliente VIP Teste',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  // 2. Criar Assinatura VIP para o cliente de teste
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: client.id },
  });

  if (!existingSub) {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 10); // Acesso Vitalício (10 anos)

    await prisma.subscription.create({
      data: {
        userId: client.id,
        plan: 'GOLD',
        status: 'ACTIVE',
        expiresAt: futureDate,
      },
    });
    console.log('✅ Assinatura VIP criada para o cliente de teste.');
  }

  // 3. Criar Categorias Padrão
  const catFiccao = await prisma.category.upsert({
    where: { slug: 'ficcao-acao' },
    update: {},
    create: { name: 'Ficção & Ação', slug: 'ficcao-acao' },
  });

  const catAcao = await prisma.category.upsert({
    where: { slug: 'acao' },
    update: {},
    create: { name: 'Ação', slug: 'acao' },
  });

  const catAventura = await prisma.category.upsert({
    where: { slug: 'aventura' },
    update: {},
    create: { name: 'Aventura', slug: 'aventura' },
  });

  const catFantasia = await prisma.category.upsert({
    where: { slug: 'fantasia' },
    update: {},
    create: { name: 'Fantasia', slug: 'fantasia' },
  });

  // 4. Criar Filmes Iniciais
  const moviesData = [
    {
      title: 'The Batman',
      description: 'Batman aventura-se no submundo de Gotham City quando um assassino sádico deixa para trás um rastro de pistas enigmáticas.',
      year: 2022,
      rating: 4.6,
      duration: '2h 56m',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
      videoUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1',
      isFeatured: true,
      categoryId: catFiccao.id,
    },
    {
      title: 'Black Panther: Wakanda Forever',
      description: 'A rainha Ramonda, Shuri, M’Baku, Okoye e as Dora Milaje lutam para proteger a sua nação das potências mundiais intervenientes após a morte do Rei T’Challa.',
      year: 2022,
      rating: 4.5,
      duration: '2h 41m',
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/embed/_Z3QKkl1WyM?autoplay=1',
      isFeatured: false,
      categoryId: catAcao.id,
    },
    {
      title: 'Jumanji: Next Level',
      description: 'A turma está de volta, mas o jogo mudou. Quando eles retornam a Jumanji para resgatar um dos seus, eles descobrem que nada é o que esperam.',
      year: 2021,
      rating: 4.3,
      duration: '2h 03m',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/embed/rBxcF-r9Ibs?autoplay=1',
      isFeatured: false,
      categoryId: catAventura.id,
    },
    {
      title: 'Doctor Strange: Multiverse of Madness',
      description: 'Doutor Estranho viaja para o desconhecido com a ajuda de aliados místicos antigos e novos através das realidades alternativas do Multiverso.',
      year: 2022,
      rating: 4.7,
      duration: '2h 06m',
      posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/embed/aWzlQ2N6ucg?autoplay=1',
      isFeatured: false,
      categoryId: catFantasia.id,
    },
    {
      title: 'Dune: Part One',
      description: 'Paul Atreides, um jovem brilhante e talentoso nascido para um grande destino além de sua compreensão, deve viajar para o planeta mais perigoso do universo.',
      year: 2021,
      rating: 4.8,
      duration: '2h 35m',
      posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/embed/n9xhJrPXop4?autoplay=1',
      isFeatured: false,
      categoryId: catFiccao.id,
    },
  ];

  for (const movie of moviesData) {
    const existingMovie = await prisma.movie.findFirst({
      where: { title: movie.title },
    });

    if (!existingMovie) {
      await prisma.movie.create({ data: movie });
    }
  }

  console.log('✅ Seed finalizado com sucesso!');
  console.log('Admin:', admin.email);
  console.log('Client:', client.email);
  console.log('Categorias e filmes cadastrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
