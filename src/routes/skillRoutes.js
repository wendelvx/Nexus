import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
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

export default router;