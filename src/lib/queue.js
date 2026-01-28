import { Queue } from 'bullmq';
import redis from './redis.js';

export const xpQueue = new Queue('xp-processing', { connection: redis });

export const addXpJob = async (data) => {
  await xpQueue.add('calculate-xp', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
};