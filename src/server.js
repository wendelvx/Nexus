import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import skillRoutes from './routes/skillRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/skills', skillRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexus RPG rodando em http://localhost:${PORT}`);
});