import { parse } from 'cookie';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  if (cookies.admin_auth !== '1') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [pengajuanCount, setPengajuanCount] = useState(0);
  const [statusStat, setStatusStat] = useState({ Diajukan: 0, Diproses: 0, Selesai: 0, Ditolak: 0 });
  const [loading, setLoading] = useState(true);
  const [pengajuan, setPengajuan] = useState([]);
  const [quickJenis, setQuickJenis] = useState('Keterangan');
  const [quickKet, setQuickKet] = useState('');
  const [quickMsg, setQuickMsg] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch user
      const userRes = await fetch('/api/akun');
      const userJson = await userRes.json();
      setUserCount(userJson.dataAkun ? userJson.dataAkun.length : 0);
      // Fetch pengajuan
      const pengajuanRes = await fetch('/api/pengajuan_surat');
      const pengajuanJson = await pengajuanRes.json();
      setPengajuan(pengajuanJson.pengajuanSurat || []);
      setPengajuanCount(pengajuanJson.pengajuanSurat ? pengajuanJson.pengajuanSurat.length : 0);
      // Hitung status
      const stat = { Diajukan: 0, Diproses: 0, Selesai: 0, Ditolak: 0 };
      (pengajuanJson.pengajuanSurat || []).forEach(s => {
        if (stat[s.status] !== undefined) stat[s.status]++;
      });
      setStatusStat(stat);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Data untuk grafik
  const chartData = [
    { name: 'Diajukan', value: statusStat.Diajukan },
    { name: 'Diproses', value: statusStat.Diproses },
    { name: 'Selesai', value: statusStat.Selesai },
    { name: 'Ditolak', value: statusStat.Ditolak },
  ];

  // Quick Action
  const handleQuickSubmit = async e => {
    e.preventDefault();
    setQuickMsg('');
    setQuickLoading(true);
    const res = await fetch('/api/pengajuan_surat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jenisSurat: quickJenis, keterangan: quickKet, pemohon: 'Admin', email: 'admin@desa.com' }),
    });
    setQuickLoading(false);
    if (res.ok) {
      setQuickMsg('Pengajuan berhasil ditambahkan!');
      setQuickKet('');
    } else {
      setQuickMsg('Gagal menambah pengajuan.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="dashboard-title">Dashboard Admin</h1>
      <p className="dashboard-sub">Selamat datang di panel administrasi aplikasi Pendekar!</p>
      {loading ? (
        <div className="dashboard-loading">Memuat data...</div>
      ) : (
        <>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-icon user">👥</div>
            <div className="dashboard-label">Total User</div>
            <div className="dashboard-value">{userCount}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon surat">📄</div>
            <div className="dashboard-label">Total Pengajuan Surat</div>
            <div className="dashboard-value">{pengajuanCount}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon status">⏳</div>
            <div className="dashboard-label">Diajukan</div>
            <div className="dashboard-value">{statusStat.Diajukan}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon status">🔄</div>
            <div className="dashboard-label">Diproses</div>
            <div className="dashboard-value">{statusStat.Diproses}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon status">✅</div>
            <div className="dashboard-label">Selesai</div>
            <div className="dashboard-value">{statusStat.Selesai}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon status">❌</div>
            <div className="dashboard-label">Ditolak</div>
            <div className="dashboard-value">{statusStat.Ditolak}</div>
          </div>
        </div>
        {/* Grafik Statistik Pengajuan */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Statistik Pengajuan Surat</h3>
          <div className="dashboard-chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#764ba2" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Quick Action Tambah Pengajuan */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Quick Action: Tambah Pengajuan Surat</h3>
          <form className="quick-form" onSubmit={handleQuickSubmit} autoComplete="off">
            <select value={quickJenis} onChange={e => setQuickJenis(e.target.value)} required>
              <option value="Keterangan">Keterangan</option>
              <option value="Domisili">Domisili</option>
              <option value="Usaha">Usaha</option>
            </select>
            <input
              type="text"
              value={quickKet}
              onChange={e => setQuickKet(e.target.value)}
              placeholder="Keterangan pengajuan"
              required
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={quickLoading}>
              {quickLoading ? 'Memproses...' : 'Tambah'}
            </button>
          </form>
          {quickMsg && <div className="quick-msg">{quickMsg}</div>}
        </div>
        {/* Tabel Detail Pengajuan */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">Tabel Detail Pengajuan Surat</h3>
          <div className="table-wrapper">
            <table className="pengajuan-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Jenis Surat</th>
                  <th>Keterangan</th>
                  <th>Pemohon</th>
                  <th>Email</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pengajuan.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row">Belum ada permohonan surat</td></tr>
                ) : (
                  pengajuan.slice().reverse().map((item, idx) => (
                    <tr key={item.id}>
                      <td>{pengajuan.length - idx}</td>
                      <td>{item.jenisSurat}</td>
                      <td>{item.keterangan}</td>
                      <td>{item.pemohon || '-'}</td>
                      <td>{item.email || '-'}</td>
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
        </div>
        </>
      )}
      <style jsx>{`
        .admin-dashboard-container {
          max-width: 1100px;
          margin: 40px auto 0 auto;
          padding: 32px 16px;
          background: rgba(255,255,255,0.15);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .dashboard-title {
          text-align: center;
          font-size: 2.3rem;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dashboard-sub {
          text-align: center;
          color: #4b5563;
          font-size: 1.1rem;
          margin-bottom: 32px;
        }
        .dashboard-loading {
          text-align: center;
          color: #6366f1;
          font-weight: 500;
          margin: 18px 0;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 24px;
        }
        .dashboard-card {
          background: rgba(255,255,255,0.7);
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(118,75,162,0.08);
          padding: 28px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s, transform 0.2s;
          border: 1px solid #e0e7ff;
          position: relative;
        }
        .dashboard-card:hover {
          box-shadow: 0 8px 32px rgba(118,75,162,0.18);
          transform: translateY(-2px) scale(1.03);
        }
        .dashboard-icon {
          font-size: 2.2rem;
          margin-bottom: 10px;
        }
        .dashboard-label {
          font-size: 1.08rem;
          color: #6366f1;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .dashboard-value {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
        }
        .dashboard-section {
          margin-top: 40px;
        }
        .dashboard-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #764ba2;
          margin-bottom: 18px;
        }
        .dashboard-chart-wrapper {
          width: 100%;
          min-height: 260px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(118,75,162,0.08);
          padding: 18px 8px 8px 8px;
        }
        .quick-form {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }
        .quick-form select, .quick-form input {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #c7d2fe;
          background: rgba(255,255,255,0.7);
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .quick-form select:focus, .quick-form input:focus {
          border: 1.5px solid #764ba2;
          background: #fff;
        }
        .quick-form button {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(118,75,162,0.12);
          transition: background 0.2s, transform 0.1s;
        }
        .quick-form button:active {
          transform: scale(0.98);
        }
        .quick-form button:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .quick-msg {
          color: #059669;
          font-size: 1rem;
          margin-top: 4px;
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
        @media (max-width: 600px) {
          .dashboard-title {
            font-size: 1.5rem;
          }
          .dashboard-card {
            padding: 18px 6px 12px 6px;
          }
        }
      `}</style>
      <style jsx global>{`
        .recharts-legend-item-text { font-size: 1rem !important; }
      `}</style>
    </div>
  );
}

// Helper untuk warna status
function statusColor(status) {
  switch (status) {
    case 'Diajukan': return '#fbbf24';
    case 'Diproses': return '#3b82f6';
    case 'Selesai': return '#10b981';
    case 'Ditolak': return '#ef4444';
    default: return '#a1a1aa';
  }
} 