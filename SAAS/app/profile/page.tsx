import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AccessDenied from '@/components/AccessDenied';
import ProfileClient from './ProfileClient';
import { getSubscriptionHistory } from '@/lib/actions/subscription';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex min-h-screen bg-[#08090c]">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
          <Header />
          <AccessDenied message="Crie uma conta para gerenciar seu perfil e ver seu histórico." />
        </div>
      </div>
    );
  }

  const user = session.user as any;
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { subscriptions: true },
  });

  if (!dbUser) {
    return (
      <div className="flex min-h-screen bg-[#08090c]">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
          <Header />
          <AccessDenied message="Usuário não encontrado no sistema." />
        </div>
      </div>
    );
  }

  const activeSub = dbUser.subscriptions.find(s => s.status === 'ACTIVE' && s.expiresAt > new Date());
  const isFree = !activeSub && dbUser.role !== 'ADMIN';

  // Busca o histórico completo de assinaturas
  const subscriptionHistory = await getSubscriptionHistory(dbUser.id);

  // Serializa a assinatura ativa para o client component
  const activeSubSerialized = activeSub ? {
    id: activeSub.id,
    plan: activeSub.plan,
    status: activeSub.status,
    expiresAt: activeSub.expiresAt.toISOString(),
    createdAt: activeSub.createdAt.toISOString(),
    paymentGatewayId: activeSub.paymentGatewayId,
  } : null;

  return (
    <div className="flex min-h-screen bg-[#08090c] text-white">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header />

        <main className="px-4 py-6 md:p-8 flex-1 max-w-4xl w-full mx-auto">
          <ProfileClient
            user={{
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
              createdAt: dbUser.createdAt.toISOString(),
            }}
            activeSub={activeSubSerialized}
            isFree={isFree}
            subscriptionHistory={subscriptionHistory}
          />
        </main>
      </div>
    </div>
  );
}
