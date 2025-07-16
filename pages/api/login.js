import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin && admin.password === password) { // Untuk produksi, gunakan hash!
    res.setHeader('Set-Cookie', `admin_auth=1; Path=/; HttpOnly; SameSite=Strict`);
    return res.status(200).json({ message: 'Login berhasil' });
  } else {
    return res.status(401).json({ message: 'Email atau password salah' });
  }
} 