import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './src/lib/prisma.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/skills', async (req, res) => {
  try {
    const skills = await prisma.skillNode.findMany({
      include: {
        parents: true,
        children: true,
        modules: true
      }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a Skill Tree' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexus  rodando em http://localhost:${PORT}`);
});