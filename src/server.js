import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import './workers/xpWorker.js';
import skillRoutes from './routes/skillRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/skills', skillRoutes);
app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/submissions', submissionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexus RPG rodando em http://localhost:${PORT}`);
});