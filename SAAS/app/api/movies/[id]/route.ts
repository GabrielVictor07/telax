import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Buscar detalhes de 1 filme
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Filme não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar filme.' }, { status: 500 });
  }
}

// PUT: Editar filme (Apenas ADMIN)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.isFeatured) {
      await prisma.movie.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        year: body.year ? parseInt(body.year) : undefined,
        rating: body.rating ? parseFloat(body.rating) : undefined,
        duration: body.duration,
        posterUrl: body.posterUrl,
        bannerUrl: body.bannerUrl,
        videoUrl: body.videoUrl,
        isFeatured: body.isFeatured,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar filme.' }, { status: 500 });
  }
}

// DELETE: Remover filme (Apenas ADMIN)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Filme removido com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar filme.' }, { status: 500 });
  }
}
