import { Queue } from 'bullmq';
import redis from './redis.js';

const schedulerQueue = new Queue('scheduler-queue', { connection: redis });

export const setupRecyclingSchedule = async () => {
  await schedulerQueue.add('daily-recycling-check', {}, {
    repeat: {
      pattern: '0 0 * * *' 
    }
  });
  
  console.log("🕒 Agendamento de reciclagem configurado.");
};