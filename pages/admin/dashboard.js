import { parse } from 'cookie';
import { useEffect, useState } from 'react';

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

  return (
    <div className="admin-dashboard-container">
      <h1 className="dashboard-title">Dashboard Admin</h1>
      <p className="dashboard-sub">Selamat datang di panel administrasi aplikasi Pendekar!</p>
      {loading ? (
        <div className="dashboard-loading">Memuat data...</div>
      ) : (
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
      )}
      <style jsx>{`
        .admin-dashboard-container {
          max-width: 900px;
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
    </div>
  );
} 