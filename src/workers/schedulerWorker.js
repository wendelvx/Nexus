import { Worker } from 'bullmq';
import redis from '../lib/redis.js';
import { checkExpiredSkills } from '../services/recyclingService.js';

const worker = new Worker('scheduler-queue', async (job) => {
  if (job.name === 'daily-recycling-check') {
    await checkExpiredSkills();
  }
}, { connection: redis });

export default worker;