let dataAdmin = [
  // Contoh data awal
  { id: 1, email: 'admin@desa.com', nama: 'Admin Utama', role: 'admin' },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ dataAdmin });
  } else if (req.method === 'POST') {
    const { email, nama } = req.body;
    if (!email || !nama) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    const id = dataAdmin.length ? dataAdmin[dataAdmin.length - 1].id + 1 : 1;
    dataAdmin.push({ id, email, nama, role: 'admin' });
    return res.status(201).json({ message: 'Admin ditambahkan' });
  } else if (req.method === 'PUT') {
    const { id, email, nama } = req.body;
    const idx = dataAdmin.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    dataAdmin[idx] = { id, email, nama, role: 'admin' };
    return res.status(200).json({ message: 'Admin diupdate' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    const idx = dataAdmin.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Admin tidak ditemukan' });
    dataAdmin.splice(idx, 1);
    return res.status(200).json({ message: 'Admin dihapus' });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 