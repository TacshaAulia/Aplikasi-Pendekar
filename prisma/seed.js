const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Hapus admin lama jika ada (agar tidak duplikat)
  await prisma.admin.deleteMany();
  await prisma.admin.create({
    data: {
      email: 'admin@desa.com',
      nama: 'Admin',
      password: 'admin123', // Untuk produksi, sebaiknya di-hash!
    },
  });
  console.log('Admin default berhasil ditambahkan!');
}

main().finally(() => prisma.$disconnect()); 