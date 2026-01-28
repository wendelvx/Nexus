import Redis from 'ioredis';

const redisOptions = {
  maxRetriesPerRequest: null, 
  
};

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380',redisOptions);

redis.on('error', (err) => console.error('Erro no Redis:', err));

export default redis;