import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Validação do Token de Segurança
    const authHeader = req.headers.get('authorization') || req.headers.get('x-cakto-token');
    const expectedToken = process.env.CAKTO_WEBHOOK_TOKEN;
    
    if (!expectedToken) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[TELAX Webhook Cakto] ERRO CRÍTICO: A variável CAKTO_WEBHOOK_TOKEN não está configurada no ambiente de produção.');
        return NextResponse.json(
          { error: 'Configuração de segurança do servidor incompleta.' },
          { status: 500 }
        );
      }
      console.warn('[TELAX Webhook Cakto] AVISO: CAKTO_WEBHOOK_TOKEN ausente nas variáveis de ambiente.');
    } else {
      const tokenReceived = authHeader?.replace('Bearer ', '').trim();
      if (tokenReceived !== expectedToken) {
        console.warn('[TELAX Webhook Cakto] Tentativa de acesso não autorizada ao webhook. Header:', authHeader);
        return NextResponse.json({ error: 'Não autorizado. Token de webhook inválido.' }, { status: 401 });
      }
    }

    // 2. Leitura do Corpo da Requisição (Payload)
    const body = await req.json();
    console.log('[TELAX Webhook Cakto] Payload recebida:', JSON.stringify(body, null, 2));

    // 3. Extração dos Dados do Evento e Status
    const event = String(body.event || body.type || '').toLowerCase();
    const status = String(body.status || body.data?.status || body.transaction?.status || '').toLowerCase();

    // Identifica se é aprovação de pagamento
    const isApproved =
      event === 'order_approved' ||
      event === 'payment_approved' ||
      status === 'approved' ||
      status === 'paid';

    // Identifica se é reembolso, estorno, cancelamento ou chargeback
    const isRefunded =
      event === 'order_refunded' ||
      event === 'order_canceled' ||
      event === 'refund_approved' ||
      event === 'dispute' ||
      status === 'refunded' ||
      status === 'charged_back' ||
      status === 'canceled' ||
      status === 'chargeback' ||
      status === 'refund';

    if (!isApproved && !isRefunded) {
      console.log(`[TELAX Webhook Cakto] Evento/Status ignorado: ${event} / ${status}`);
      return NextResponse.json({ received: true, ignored: true, reason: `Evento/Status ignorado: ${event} / ${status}` });
    }

    // 4. Extração do Identificador do Usuário (Email ou SRC)
    const customerEmail = body.customer?.email || body.data?.customer?.email || body.email;
    const src = body.metadata?.src || body.data?.src || body.src || body.utm_source;

    if (!customerEmail && !src) {
      console.error('[TELAX Webhook Cakto] Não foi possível identificar o usuário (sem email ou src).');
      return NextResponse.json({ error: 'Usuário não identificado no payload.' }, { status: 400 });
    }

    // 5. Busca do Usuário no Banco de Dados
    let user = null;

    if (src) {
      user = await prisma.user.findUnique({ where: { id: String(src) } });
    }

    if (!user && customerEmail) {
      user = await prisma.user.findUnique({ where: { email: String(customerEmail) } });
    }

    if (!user) {
      console.error(`[TELAX Webhook Cakto] Usuário não encontrado no banco. E-mail: ${customerEmail}, SRC: ${src}`);
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const transactionId = String(body.transaction_id || body.data?.id || body.id || `cakto_${Date.now()}`);

    // 6. PROCESSAMENTO DE REEMBOLSO / ESTORNO
    if (isRefunded) {
      // Cancela a assinatura ativa do usuário no banco
      const updated = await prisma.subscription.updateMany({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        data: {
          status: 'CANCELED',
          expiresAt: new Date(),
        },
      });

      console.log(`[TELAX Webhook Cakto] 🚫 REEMBOLSO/ESTORNO PROCESSADO! Usuário: ${user.email} (ID: ${user.id}). ${updated.count} assinatura(s) cancelada(s).`);
      return NextResponse.json({ received: true, status: 'refund_processed', canceledSubscriptions: updated.count });
    }

    // 7. ATIVAÇÃO DE ACESSO (APROVADO)
    if (isApproved) {
      const existingSub = await prisma.subscription.findFirst({
        where: { paymentGatewayId: transactionId },
      });

      if (!existingSub) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 100); // 100 anos = Vitalício

        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: 'PLATINUM', // Plano Vitalício
            status: 'ACTIVE',
            paymentGatewayId: transactionId,
            expiresAt,
          },
        });
        console.log(`[TELAX Webhook Cakto] ✅ Acesso Vitalício ativado para o usuário ${user.email} (ID: ${user.id})!`);
      } else {
        // Garantir que esteja ACTIVE caso estivesse cancelada anteriormente
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: { status: 'ACTIVE' },
        });
        console.log(`[TELAX Webhook Cakto] Assinatura já existente atualizada para ACTIVE. Transação: ${transactionId}.`);
      }

      return NextResponse.json({ received: true, status: 'approved_processed' });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[TELAX Webhook Cakto] Erro interno:', error);
    return NextResponse.json({ error: 'Erro no processamento.' }, { status: 500 });
  }
}

