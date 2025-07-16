import { useEffect, useState } from 'react';

const statusColor = status => {
  switch (status) {
    case 'Diajukan': return '#fbbf24'; // kuning
    case 'Diproses': return '#3b82f6'; // biru
    case 'Selesai': return '#10b981'; // hijau
    case 'Ditolak': return '#ef4444'; // merah
    default: return '#a1a1aa'; // abu
  }
};

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
    <div className="pengajuan-container">
      <div className="pengajuan-card">
        <h2 className="pengajuan-title">Daftar Permohonan Surat</h2>
        {loading && <div className="pengajuan-loading">Memuat data...</div>}
        {error && <div className="pengajuan-error">{error}</div>}
      {!loading && !error && (
          <div className="table-wrapper">
            <table className="pengajuan-table">
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
                  <tr><td colSpan="5" className="empty-row">Belum ada permohonan surat</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.jenisSurat}</td>
                  <td>{item.keterangan}</td>
                  <td>{new Date(item.tanggal).toLocaleString()}</td>
                      <td>
                        <span className="status-badge" style={{ background: statusColor(item.status) }}>{item.status}</span>
                      </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
      )}
      </div>
      <style jsx>{`
        .pengajuan-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
          padding: 24px 0;
        }
        .pengajuan-card {
          width: 100%;
          max-width: 700px;
          background: rgba(255,255,255,0.18);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 32px 18px 24px 18px;
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .pengajuan-title {
          text-align: center;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 18px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pengajuan-loading {
          text-align: center;
          color: #6366f1;
          font-weight: 500;
          margin: 18px 0;
        }
        .pengajuan-error {
          text-align: center;
          color: #ef4444;
          background: rgba(255,0,0,0.08);
          border-radius: 8px;
          padding: 8px 12px;
          margin: 18px 0;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .pengajuan-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(118,75,162,0.08);
        }
        .pengajuan-table th, .pengajuan-table td {
          padding: 12px 10px;
          text-align: left;
        }
        .pengajuan-table th {
          background: #f3f4f6;
          color: #4b5563;
          font-weight: 600;
          font-size: 1rem;
        }
        .pengajuan-table tbody tr {
          transition: background 0.15s;
        }
        .pengajuan-table tbody tr:hover {
          background: #ede9fe;
        }
        .empty-row {
          text-align: center;
          color: #a1a1aa;
          font-style: italic;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 16px;
          color: #fff;
          font-size: 0.98rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }
        @keyframes fadeInLogin {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 700px) {
          .pengajuan-card {
            padding: 18px 2px 12px 2px;
          }
          .pengajuan-table th, .pengajuan-table td {
            padding: 8px 4px;
            font-size: 0.98rem;
          }
        }
      `}</style>
    </div>
  );
} 