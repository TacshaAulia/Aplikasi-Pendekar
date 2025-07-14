import { useEffect, useState } from 'react';

export default function DaftarPengajuanSurat() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', marginTop: 40 }}>
      <h2>Daftar Permohonan Surat</h2>
      {loading && <p>Memuat data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Jenis Surat</th>
              <th>Keterangan</th>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5">Belum ada permohonan surat</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.jenisSurat}</td>
                  <td>{item.keterangan}</td>
                  <td>{new Date(item.tanggal).toLocaleString()}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 