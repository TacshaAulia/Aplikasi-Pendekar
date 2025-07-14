let pengajuanSurat = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { jenisSurat, keterangan } = req.body;
    if (!jenisSurat || !keterangan) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    pengajuanSurat.push({
      id: pengajuanSurat.length + 1,
      jenisSurat,
      keterangan,
      tanggal: new Date().toISOString(),
      status: 'Diajukan',
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