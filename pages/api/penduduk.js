let dataPenduduk = [
  // Contoh data awal
  { id: 1, nik: '3201010101010001', nama: 'Budi', alamat: 'Jl. Mawar', tanggal_lahir: '1990-01-01' },
  { id: 2, nik: '3201010101010002', nama: 'Siti', alamat: 'Jl. Melati', tanggal_lahir: '1992-02-02' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ dataPenduduk });
  } else if (req.method === 'POST') {
    const { nik, nama, alamat, tanggal_lahir } = req.body;
    if (!nik || !nama || !alamat || !tanggal_lahir) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const id = dataPenduduk.length ? dataPenduduk[dataPenduduk.length - 1].id + 1 : 1;
    dataPenduduk.push({ id, nik, nama, alamat, tanggal_lahir });
    return res.status(201).json({ message: 'Data penduduk ditambahkan' });
  } else if (req.method === 'PUT') {
    const { id, nik, nama, alamat, tanggal_lahir } = req.body;
    const idx = dataPenduduk.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });
    dataPenduduk[idx] = { id, nik, nama, alamat, tanggal_lahir };
    return res.status(200).json({ message: 'Data penduduk diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = dataPenduduk.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });
    dataPenduduk.splice(idx, 1);
    return res.status(200).json({ message: 'Data penduduk dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 