let dataAkun = [
  // Contoh data awal
  { id: 1, email: 'admin@desa.com', nama: 'Admin', role: 'admin' },
  { id: 2, email: 'user@desa.com', nama: 'User', role: 'user' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ dataAkun });
  } else if (req.method === 'POST') {
    const { email, nama, role } = req.body;
    if (!email || !nama || !role) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const id = dataAkun.length ? dataAkun[dataAkun.length - 1].id + 1 : 1;
    dataAkun.push({ id, email, nama, role });
    return res.status(201).json({ message: 'Akun ditambahkan' });
  } else if (req.method === 'PUT') {
    const { id, email, nama, role } = req.body;
    const idx = dataAkun.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    dataAkun[idx] = { id, email, nama, role };
    return res.status(200).json({ message: 'Akun diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = dataAkun.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    dataAkun.splice(idx, 1);
    return res.status(200).json({ message: 'Akun dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 