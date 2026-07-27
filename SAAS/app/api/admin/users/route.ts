import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

// GET: Listar todos os usuários e assinaturas (Apenas ADMIN)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários.' }, { status: 500 });
  }
}

// PUT: Atualizar papel ou plano de um usuário
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { userId, role, plan } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'UserID é obrigatório.' }, { status: 400 });
    }

    const adminId = (session.user as any).id || 'usr_admin_temp_01';

    if (role) {
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
      await createAuditLog({
        action: 'UPDATE_USER_ROLE',
        details: `Alterada a permissão do usuário ${userId} para ${role}`,
        adminId,
        req,
      });
    }

    if (plan) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: 'ACTIVE',
          expiresAt,
        },
      });
      await createAuditLog({
        action: 'CREATE_USER_SUBSCRIPTION',
        details: `Ativado o plano ${plan} para o usuário ${userId}`,
        adminId,
        req,
      });
    }

    return NextResponse.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário.' }, { status: 500 });
  }
}
