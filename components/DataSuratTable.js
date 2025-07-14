import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'];

export default function DataSuratTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ jenis: '', nomor: '', pemohon: '', tanggal: '', status: 'Diajukan' });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/surat');
      const json = await res.json();
      if (res.ok) {
        setData(json.dataSurat || []);
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
    const res = await fetch('/api/surat', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setForm({ jenis: '', nomor: '', pemohon: '', tanggal: '', status: 'Diajukan' });
      setEditId(null);
      fetchData();
    } else {
      setError(json.message || 'Gagal simpan data');
    }
  };

  const handleEdit = item => {
    setForm({ jenis: item.jenis, nomor: item.nomor, pemohon: item.pemohon, tanggal: item.tanggal, status: item.status });
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!confirm('Hapus surat ini?')) return;
    const res = await fetch('/api/surat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', marginTop: 40 }}>
      <h2>Data Surat</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="jenis" value={form.jenis} onChange={handleChange} placeholder="Jenis Surat" required />{' '}
        <input name="nomor" value={form.nomor} onChange={handleChange} placeholder="Nomor Surat" required />{' '}
        <input name="pemohon" value={form.pemohon} onChange={handleChange} placeholder="Nama Pemohon" required />{' '}
        <input name="tanggal" value={form.tanggal} onChange={handleChange} placeholder="Tanggal (YYYY-MM-DD)" required />{' '}
        <select name="status" value={form.status} onChange={handleChange} required>
          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>{' '}
        <button type="submit">{editId ? 'Update' : 'Tambah'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ jenis: '', nomor: '', pemohon: '', tanggal: '', status: 'Diajukan' }); }}>Batal</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Memuat data...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Jenis</th>
              <th>Nomor</th>
              <th>Pemohon</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="7">Belum ada data</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.jenis}</td>
                  <td>{item.nomor}</td>
                  <td>{item.pemohon}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.status}</td>
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