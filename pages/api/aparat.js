let dataAparat = [
  // Contoh data awal
  { id: 1, nama: 'Pak RT', jabatan: 'Ketua RT', nip: '123456', alamat: 'Jl. Kenanga' },
  { id: 2, nama: 'Bu RW', jabatan: 'Ketua RW', nip: '654321', alamat: 'Jl. Anggrek' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ dataAparat });
  } else if (req.method === 'POST') {
    const { nama, jabatan, nip, alamat } = req.body;
    if (!nama || !jabatan || !nip || !alamat) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const id = dataAparat.length ? dataAparat[dataAparat.length - 1].id + 1 : 1;
    dataAparat.push({ id, nama, jabatan, nip, alamat });
    return res.status(201).json({ message: 'Data aparat ditambahkan' });
  } else if (req.method === 'PUT') {
    const { id, nama, jabatan, nip, alamat } = req.body;
    const idx = dataAparat.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });
    dataAparat[idx] = { id, nama, jabatan, nip, alamat };
    return res.status(200).json({ message: 'Data aparat diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = dataAparat.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Data tidak ditemukan' });
    dataAparat.splice(idx, 1);
    return res.status(200).json({ message: 'Data aparat dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 