import redis from '../lib/redis.js';

const LEADERBOARD_KEY = 'nexus:leaderboard:global';

export const updatePlayerRank = async (playerName, xp) => {
  await redis.zadd(LEADERBOARD_KEY, xp, playerName);
};

export const getTopPlayers = async (limit = 10) => {
  
  const rawData = await redis.zrevrange(LEADERBOARD_KEY, 0, limit - 1, 'WITHSCORES');
  
  const leaderboard = [];
  for (let i = 0; i < rawData.length; i += 2) {
    leaderboard.push({
      name: rawData[i],
      xp: parseInt(rawData[i + 1], 10),
      rank: (i / 2) + 1
    });
  }
  return leaderboard;
};