import { useEffect, useState } from 'react';

export default function DataAkunTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', nama: '', role: 'user' });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/akun');
      const json = await res.json();
      if (res.ok) {
        setData(json.dataAkun || []);
      } else {
        setError(json.message || 'Gagal mengambil data');
      }
    } catch (e) {
      setError('Gagal mengambil data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { ...form, id: editId } : form;
    const res = await fetch('/api/akun', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setForm({ email: '', nama: '', role: 'user' });
      setEditId(null);
      fetchData();
    } else {
      setError(json.message || 'Gagal simpan data');
    }
  };

  const handleEdit = item => {
    setForm({ email: item.email, nama: item.nama, role: item.role });
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!confirm('Hapus akun ini?')) return;
    const res = await fetch('/api/akun', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', marginTop: 40 }}>
      <h2>Data Akun Pengguna</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />{' '}
        <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />{' '}
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>{' '}
        <button type="submit">{editId ? 'Update' : 'Tambah'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ email: '', nama: '', role: 'user' }); }}>Batal</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Memuat data...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5">Belum ada data</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.email}</td>
                  <td>{item.nama}</td>
                  <td>{item.role}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(item.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 