import { useEffect, useState } from 'react';

export default function DataAparatTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nama: '', jabatan: '', nip: '', alamat: '' });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/aparat');
      const json = await res.json();
      if (res.ok) {
        setData(json.dataAparat || []);
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
    const res = await fetch('/api/aparat', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setForm({ nama: '', jabatan: '', nip: '', alamat: '' });
      setEditId(null);
      fetchData();
    } else {
      setError(json.message || 'Gagal simpan data');
    }
  };

  const handleEdit = item => {
    setForm({ nama: item.nama, jabatan: item.jabatan, nip: item.nip, alamat: item.alamat });
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!confirm('Hapus data ini?')) return;
    const res = await fetch('/api/aparat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', marginTop: 40 }}>
      <h2>Data Aparat Desa</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />{' '}
        <input name="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Jabatan" required />{' '}
        <input name="nip" value={form.nip} onChange={handleChange} placeholder="NIP" required />{' '}
        <input name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat" required />{' '}
        <button type="submit">{editId ? 'Update' : 'Tambah'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nama: '', jabatan: '', nip: '', alamat: '' }); }}>Batal</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Memuat data...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>NIP</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="6">Belum ada data</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.jabatan}</td>
                  <td>{item.nip}</td>
                  <td>{item.alamat}</td>
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