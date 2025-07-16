let pengajuanSurat = [
  // Data pengajuan contoh
  {
    id: 1,
    jenisSurat: 'Keterangan',
    keterangan: 'Surat keterangan usaha untuk keperluan bank',
    tanggal: '2024-06-01T09:00:00.000Z',
    status: 'Selesai',
    pemohon: 'Budi Santoso',
    email: 'budi@gmail.com',
  },
  {
    id: 2,
    jenisSurat: 'Domisili',
    keterangan: 'Surat domisili untuk keperluan sekolah',
    tanggal: '2024-06-02T10:30:00.000Z',
    status: 'Diproses',
    pemohon: 'Siti Aminah',
    email: 'siti@gmail.com',
  },
  {
    id: 3,
    jenisSurat: 'Usaha',
    keterangan: 'Surat usaha toko kelontong',
    tanggal: '2024-06-03T14:15:00.000Z',
    status: 'Diajukan',
    pemohon: 'Agus Salim',
    email: 'agus@gmail.com',
  },
  {
    id: 4,
    jenisSurat: 'Keterangan',
    keterangan: 'Surat keterangan belum menikah',
    tanggal: '2024-06-04T08:45:00.000Z',
    status: 'Ditolak',
    pemohon: 'Rina Marlina',
    email: 'rina@gmail.com',
  },
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { jenisSurat, keterangan, pemohon, email } = req.body;
    if (!jenisSurat || !keterangan) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    pengajuanSurat.push({
      id: pengajuanSurat.length + 1,
      jenisSurat,
      keterangan,
      tanggal: new Date().toISOString(),
      status: 'Diajukan',
      pemohon: pemohon || '',
      email: email || '',
    });
    return res.status(200).json({ message: 'Pengajuan surat berhasil' });
  } else if (req.method === 'GET') {
    return res.status(200).json({ pengajuanSurat });
  } else if (req.method === 'PUT') {
    const { id, status } = req.body;
    const idx = pengajuanSurat.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Permohonan tidak ditemukan' });
    pengajuanSurat[idx].status = status;
    return res.status(200).json({ message: 'Status permohonan diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = pengajuanSurat.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Permohonan tidak ditemukan' });
    pengajuanSurat.splice(idx, 1);
    return res.status(200).json({ message: 'Permohonan dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 