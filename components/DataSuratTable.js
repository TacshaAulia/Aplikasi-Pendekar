import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'];
const statusColors = {
  Diajukan: '#3498db',
  Diproses: '#f1c40f',
  Selesai: '#2ecc71',
  Ditolak: '#e74c3c',
};

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      padding: '40px 0',
    }}>
      <div style={{
        maxWidth: 1000,
        margin: 'auto',
        background: 'rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(8px)',
        borderRadius: 24,
        padding: 32,
        border: '1px solid rgba(255,255,255,0.18)',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 1,
          color: '#fff',
          marginBottom: 24,
          textShadow: '0 2px 8px #0006',
        }}>Data Surat</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          justifyContent: 'center',
        }}>
          <input name="jenis" value={form.jenis} onChange={handleChange} placeholder="Jenis Surat" required style={inputStyle} />
          <input name="nomor" value={form.nomor} onChange={handleChange} placeholder="Nomor Surat" required style={inputStyle} />
          <input name="pemohon" value={form.pemohon} onChange={handleChange} placeholder="Nama Pemohon" required style={inputStyle} />
          <input name="tanggal" value={form.tanggal} onChange={handleChange} placeholder="Tanggal (YYYY-MM-DD)" required style={inputStyle} />
          <select name="status" value={form.status} onChange={handleChange} required style={selectStyle}>
          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button type="submit" style={buttonStyle}>{editId ? 'Update' : 'Tambah'}</button>
          {editId && <button type="button" style={{...buttonStyle, background:'#888'}} onClick={() => { setEditId(null); setForm({ jenis: '', nomor: '', pemohon: '', tanggal: '', status: 'Diajukan' }); }}>Batal</button>}
      </form>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</p>}
        {loading ? <p style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
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
                  <tr><td colSpan="7" style={{ textAlign: 'center', color: '#fff' }}>Belum ada data</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.jenis}</td>
                  <td>{item.nomor}</td>
                  <td>{item.pemohon}</td>
                  <td>{item.tanggal}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 14px',
                          borderRadius: 12,
                          background: statusColors[item.status] || '#888',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 14,
                        }}>{item.status}</span>
                      </td>
                      <td>
                        <button style={actionBtn} onClick={() => handleEdit(item)}>Edit</button>{' '}
                        <button style={{...actionBtn, background:'#e74c3c'}} onClick={() => handleDelete(item.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
      )}
      </div>
    </div>
  );
} 

const inputStyle = {
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid #fff',
  background: 'rgba(255,255,255,0.25)',
  color: '#222',
  fontSize: 16,
  outline: 'none',
  boxShadow: '0 2px 8px #0001',
  minWidth: 140,
};

const selectStyle = {
  borderRadius: 10,
  padding: '8px 10px',
  border: '1px solid #fff',
  background: 'rgba(255,255,255,0.25)',
  color: '#222',
  fontSize: 16,
  outline: 'none',
  minWidth: 120,
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(90deg,#36d1c4,#5b86e5)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0002',
  transition: 'background 0.2s',
};

const actionBtn = {
  ...buttonStyle,
  padding: '6px 14px',
  fontSize: 14,
  margin: '0 2px',
  background: 'linear-gradient(90deg,#43cea2,#185a9d)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'rgba(255,255,255,0.10)',
  borderRadius: 16,
  overflow: 'hidden',
  color: '#fff',
  boxShadow: '0 2px 16px #0002',
}; 