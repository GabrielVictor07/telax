import { prisma } from '@/lib/prisma';

export async function createAuditLog({
  action,
  details,
  adminId,
  req,
}: {
  action: string;
  details?: string;
  adminId: string;
  req?: Request;
}) {
  try {
    let ipAddress = '127.0.0.1';

    if (req) {
      ipAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';
    }

    // Se o adminId for temporário de teste (usr_admin_temp_01), não grava no banco caso o Prisma não encontre o id
    if (adminId.startsWith('usr_')) {
      console.log(`[Audit Log - Dev] Action: ${action} | Details: ${details} | IP: ${ipAddress}`);
      return;
    }

    await prisma.auditLog.create({
      data: {
        action,
        details,
        ipAddress,
        adminId,
      },
    });
  } catch (error) {
    console.error('Erro ao gravar Audit Log:', error);
  }
}
