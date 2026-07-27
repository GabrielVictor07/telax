import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'telax-media';
export const PUBLIC_URL_BASE = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

export function isR2Configured(): boolean {
  const isDummy =
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    accountId.includes('your_') ||
    accessKeyId.includes('your_') ||
    secretAccessKey.includes('your_') ||
    accountId.includes('sua_') ||
    accessKeyId.includes('sua_');

  return !isDummy;
}

// Configuração do Cliente Cloudflare R2 via AWS SDK S3
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: isR2Configured() ? `https://${accountId}.r2.cloudflarestorage.com` : 'https://fake.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Gera uma Signed URL temporária de reprodução no R2 (expira em 3 horas por padrão).
 * Se as credenciais do R2 não estiverem ativas, retorna a URL original (modo fallback).
 */
export async function generateSignedStreamUrl(key: string, expiresInSeconds: number = 10800): Promise<string> {
  if (!isR2Configured() || key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
    return signedUrl;
  } catch (error) {
    console.error('[Cloudflare R2 Error] Falha ao gerar Signed URL:', error);
    return key;
  }
}

/**
 * Realiza o upload de um buffer de arquivo para o balde do Cloudflare R2.
 */
export async function uploadToR2(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const key = `media/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

  if (!isR2Configured()) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Cloudflare R2 Critical Error] Tentativa de upload sem credenciais R2 válidas configuradas no .env em Produção!');
      throw new Error('Falha no upload: Armazenamento Cloudflare R2 não configurado no servidor.');
    }
    console.log(`[Simulação R2 Local] Credenciais não configuradas. Fallback ativo para a chave: ${key}`);
    return `/uploads/${fileName}`;
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  if (PUBLIC_URL_BASE) {
    return `${PUBLIC_URL_BASE}/${key}`;
  }

  return key;
}
