let dataSurat = [
  // Contoh data awal
  { id: 1, jenis: 'Keterangan', nomor: '001/SRT/2024', pemohon: 'Budi', tanggal: '2024-06-01', status: 'Selesai' },
  { id: 2, jenis: 'Domisili', nomor: '002/SRT/2024', pemohon: 'Siti', tanggal: '2024-06-02', status: 'Diproses' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ dataSurat });
  } else if (req.method === 'POST') {
    const { jenis, nomor, pemohon, tanggal, status } = req.body;
    if (!jenis || !nomor || !pemohon || !tanggal || !status) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const id = dataSurat.length ? dataSurat[dataSurat.length - 1].id + 1 : 1;
    dataSurat.push({ id, jenis, nomor, pemohon, tanggal, status });
    return res.status(201).json({ message: 'Surat ditambahkan' });
  } else if (req.method === 'PUT') {
    const { id, jenis, nomor, pemohon, tanggal, status } = req.body;
    const idx = dataSurat.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    dataSurat[idx] = { id, jenis, nomor, pemohon, tanggal, status };
    return res.status(200).json({ message: 'Surat diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = dataSurat.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    dataSurat.splice(idx, 1);
    return res.status(200).json({ message: 'Surat dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 