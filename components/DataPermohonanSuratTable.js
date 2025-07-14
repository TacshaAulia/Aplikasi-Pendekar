import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'];

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
    <div style={{ maxWidth: 900, margin: 'auto', marginTop: 40 }}>
      <h2>Data Permohonan Surat</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Memuat data...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              <tr><td colSpan="6">Belum ada permohonan</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.jenisSurat}</td>
                  <td>{item.keterangan}</td>
                  <td>{new Date(item.tanggal).toLocaleString()}</td>
                  <td>
                    <select value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)}>
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(item.id)}>Hapus</button>{' '}
                    <button onClick={() => handleDownload(item.id)}>Download PDF</button>
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