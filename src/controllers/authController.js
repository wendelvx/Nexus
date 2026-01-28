import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "E-mail já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "Player criado com sucesso!", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.errors || "Erro no registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Credenciais inválidas" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'nexus_secret_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { name: user.name, level: user.level, xp: user.xp } });
  } catch (error) {
    res.status(400).json({ error: error.errors || "Erro no login" });
  }
};