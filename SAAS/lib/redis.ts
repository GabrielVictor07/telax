import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
});

redis.on('error', (err) => {
  // Tratamento de aviso para não quebrar a aplicação caso o Redis esteja offline
  console.warn('[Redis Cache Warning]: Não foi possível conectar ao Redis:', err.message);
});

// Helper de Cache: get ou execute fallback
export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Se falhar o cache, ignora e busca direto no banco
  }

  const freshData = await fetcher();

  try {
    await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
  } catch {
    // Ignora erro de gravação
  }

  return freshData;
}
