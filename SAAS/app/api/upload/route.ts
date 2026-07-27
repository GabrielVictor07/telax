import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Permissões de Upload: Whitelist de extensões e tipos MIME permitidos
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.mp4',
  '.webm',
  '.mov',
]);

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

// Helper to determine if R2 is configured
const isR2Configured = 
  process.env.CLOUDFLARE_R2_ACCOUNT_ID && 
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
  process.env.CLOUDFLARE_R2_BUCKET_NAME &&
  process.env.CLOUDFLARE_R2_ACCOUNT_ID !== 'your_account_id';

let s3Client: S3Client | null = null;

if (isR2Configured) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verificação de Autenticação e Permissão (Apenas Administradores)
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado. Permissão de administrador necessária.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // 2. Validação do Tamanho do Arquivo
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'O arquivo excede o limite máximo permitido de 500MB.' }, { status: 400 });
    }

    // 3. Validação de MIME Type e Extensão do Arquivo
    const fileExtension = extname(file.name).toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido (${file.type || fileExtension}). Envie apenas imagens ou vídeos válidos.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Geração de Nome Seguro e Sanitizado
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedBaseName = file.name
      .replace(extname(file.name), '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedBaseName}${fileExtension}`;
    
    // --- UPLOAD VIA CLOUDFLARE R2 ---
    if (s3Client && isR2Configured) {
      try {
        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
        const publicUrlBase = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
          })
        );

        // If public URL is set, return it. Otherwise, construct a raw bucket URL (might not be public without custom domain)
        const fileUrl = publicUrlBase 
          ? `${publicUrlBase}/${filename}` 
          : `https://${bucketName}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${filename}`;

        return NextResponse.json({ url: fileUrl });
      } catch (r2Error) {
        console.error('Cloudflare R2 Upload Error:', r2Error);
        return NextResponse.json({ error: 'Falha no upload para nuvem.' }, { status: 500 });
      }
    }

    // --- FALLBACK: LOCAL UPLOAD ---
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Falha no processamento do arquivo' }, { status: 500 });
  }
}
