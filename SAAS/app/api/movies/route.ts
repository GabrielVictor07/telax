import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { movieSchema } from '@/lib/validators';

// GET: Listar todos os filmes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (category && category !== 'Todos') {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const movies = await prisma.movie.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return NextResponse.json({ error: 'Erro ao buscar filmes.' }, { status: 500 });
  }
}

// POST: Criar novo filme (Apenas ADMIN)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    const rawBody = await req.json();
    const parseResult = movieSchema.safeParse({
      ...rawBody,
      year: typeof rawBody.year === 'string' ? parseInt(rawBody.year) : rawBody.year,
      rating: typeof rawBody.rating === 'string' ? parseFloat(rawBody.rating) : rawBody.rating,
    });

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Dados de filme inválidos.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, description, year, rating, duration, posterUrl, bannerUrl, videoUrl, isFeatured, categoryId } = parseResult.data;

    if (isFeatured) {
      await prisma.movie.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        year,
        rating,
        duration: duration || '2h 00m',
        posterUrl,
        bannerUrl,
        videoUrl,
        isFeatured: !!isFeatured,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar filme.' }, { status: 500 });
  }
}
