import { isR2Configured, generateSignedStreamUrl, uploadToR2, BUCKET_NAME } from '../lib/r2';

async function runR2Diagnostic() {
  console.log('☁️ Diagnóstico do Cloudflare R2 - TELAX SaaS');
  console.log('--------------------------------------------');
  console.log('📌 Nome do Balde (Bucket):', BUCKET_NAME);
  console.log('📌 Status de Configuração das Credenciais R2:', isR2Configured() ? '✅ ATIVO (Nuvem Real)' : '⚠️ FALLBACK (Modo Local/Desenvolvimento)');

  if (!isR2Configured()) {
    console.log('\n💡 Nota: Para ativar o Cloudflare R2 em produção, preencha as variáveis CLOUDFLARE_R2_* no arquivo .env com suas chaves da Cloudflare.');
  }

  // 1. Teste de Upload Simulado/Real
  console.log('\n📤 Testando função de Upload (uploadToR2)...');
  const dummyBuffer = Buffer.from('TELAX Video Test Payload ' + Date.now());
  const testFileName = 'test-stream-file.mp4';
  
  try {
    const uploadResult = await uploadToR2(dummyBuffer, testFileName, 'video/mp4');
    console.log('✅ Resultado do Upload:', uploadResult);

    // 2. Teste de Geração de Signed URL (Expiração em 3 horas)
    console.log('\n🔑 Testando geração de Signed URL para streaming (generateSignedStreamUrl)...');
    const signedUrl = await generateSignedStreamUrl(uploadResult, 10800);
    console.log('✅ Signed URL Gerada com Sucesso:');
    console.log(signedUrl);
  } catch (error) {
    console.error('❌ Erro durante o teste do Cloudflare R2:', error);
  }

  console.log('--------------------------------------------');
  console.log('🎉 Diagnóstico do R2 concluído!');
}

runR2Diagnostic();
