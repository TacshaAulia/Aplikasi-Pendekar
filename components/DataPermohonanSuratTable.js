import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'];
const statusColors = {
  Diajukan: '#3498db',
  Diproses: '#f1c40f',
  Selesai: '#2ecc71',
  Ditolak: '#e74c3c',
};

export default function DataPermohonanSuratTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pengajuan_surat');
      const json = await res.json();
      if (res.ok) {
        setData(json.pengajuanSurat || []);
      } else {
        setError(json.message || 'Gagal mengambil data');
      }
    } catch (e) {
      setError('Gagal mengambil data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, status) => {
    const res = await fetch('/api/pengajuan_surat', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) fetchData();
  };

  const handleDelete = async id => {
    if (!confirm('Hapus permohonan ini?')) return;
    const res = await fetch('/api/pengajuan_surat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  const handleDownload = id => {
    window.open(`/api/download_surat?id=${id}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
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
        }}>Data Permohonan Surat</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</p>}
        {loading ? <p style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis Surat</th>
                  <th>Keterangan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#fff' }}>Belum ada permohonan</td></tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.jenisSurat}</td>
                      <td>{item.keterangan}</td>
                      <td>{new Date(item.tanggal).toLocaleString()}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 14px',
                          borderRadius: 12,
                          background: statusColors[item.status] || '#888',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 14,
                          marginRight: 8,
                        }}>{item.status}</span>
                        <select value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)} style={selectStyle}>
                          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      <td>
                        <button style={actionBtn} onClick={() => handleDelete(item.id)}>Hapus</button>{' '}
                        <button style={{...actionBtn, background:'#36d1c4'}} onClick={() => handleDownload(item.id)}>Download PDF</button>
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

const actionBtn = {
  padding: '6px 14px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(90deg,#43cea2,#185a9d)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0002',
  margin: '0 2px',
  transition: 'background 0.2s',
};

const selectStyle = {
  borderRadius: 10,
  padding: '4px 10px',
  border: '1px solid #fff',
  background: 'rgba(255,255,255,0.25)',
  color: '#222',
  fontSize: 14,
  outline: 'none',
  marginLeft: 4,
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