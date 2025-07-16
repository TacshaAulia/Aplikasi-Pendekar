import { parse } from 'cookie';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  if (cookies.user_auth !== '1') {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    };
  }
  // Ambil email user dari cookie jika ada (atau bisa dari session)
  const userEmail = cookies.user_email || '';
  return { props: { userEmail } };
}

export default function UserDashboard({ userEmail }) {
  // Logout handler
  const handleLogout = () => {
    document.cookie = 'user_auth=; Max-Age=0; path=/';
    document.cookie = 'user_email=; Max-Age=0; path=/';
    Router.push('/');
  };

  // State untuk ringkasan dan riwayat
  const [summary, setSummary] = useState({ Diajukan: 0, Diproses: 0, Selesai: 0, Ditolak: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function fetchPengajuan() {
      const res = await fetch('/api/pengajuan_surat');
      const json = await res.json();
      let email = userEmail;
      if (!email) {
        // Coba ambil dari localStorage jika userEmail tidak ada di props
        email = (typeof window !== 'undefined') ? localStorage.getItem('user_email') : '';
      }
      // Filter pengajuan milik user
      const userPengajuan = json.pengajuanSurat.filter(p => p.email === email);
      // Hitung status
      const stat = { Diajukan: 0, Diproses: 0, Selesai: 0, Ditolak: 0 };
      userPengajuan.forEach(s => { if (stat[s.status] !== undefined) stat[s.status]++; });
      setSummary(stat);
      // Ambil 3 pengajuan terakhir
      setRecent(userPengajuan.sort((a,b) => new Date(b.tanggal)-new Date(a.tanggal)).slice(0,3));
    }
    fetchPengajuan();
  }, [userEmail]);

  return (
    <div className="neon-dashboard-bg">
      <div className="neon-dashboard-wrapper">
        <div className="neon-dashboard-card">
          <h1 className="neon-dashboard-title">👾 Dashboard User</h1>
          <p className="neon-dashboard-sub">Aplikasi Pelayanan Surat Desa Karyalaksana</p>
          <div className="neon-dashboard-actions">
            <Link href="/user/pengajuan" legacyBehavior>
              <a className="neon-btn neon-btn-primary">Ajukan Surat</a>
            </Link>
            <Link href="/user/daftar-permohonan" legacyBehavior>
              <a className="neon-btn">Lihat Permohonan Surat</a>
            </Link>
          </div>
          <div className="neon-dashboard-feature-card">
            <h3>✨ Fitur Dashboard User</h3>
            <ul>
              <li>Mengajukan permohonan surat secara online</li>
              <li>Melihat daftar & status permohonan surat</li>
              <li>Mendapatkan notifikasi status permohonan</li>
            </ul>
          </div>
          <div className="neon-dashboard-logout-wrapper">
            <button
              onClick={handleLogout}
              className="neon-btn neon-btn-logout"
            >
              Keluar
            </button>
          </div>
        </div>
        {/* Ringkasan dan Riwayat hanya tampil di desktop/tablet */}
        <div className="neon-dashboard-extras">
          <div className="neon-summary-card">
            <h4>Ringkasan Status Pengajuan</h4>
            <div className="neon-summary-row">
              <div className="neon-summary-item" style={{background:'#3498db22', color:'#3498db'}}>
                <span className="neon-summary-label">Diajukan</span>
                <span className="neon-summary-value">{summary.Diajukan}</span>
              </div>
              <div className="neon-summary-item" style={{background:'#f1c40f22', color:'#f1c40f'}}>
                <span className="neon-summary-label">Diproses</span>
                <span className="neon-summary-value">{summary.Diproses}</span>
              </div>
              <div className="neon-summary-item" style={{background:'#2ecc7122', color:'#2ecc71'}}>
                <span className="neon-summary-label">Selesai</span>
                <span className="neon-summary-value">{summary.Selesai}</span>
              </div>
              <div className="neon-summary-item" style={{background:'#e74c3c22', color:'#e74c3c'}}>
                <span className="neon-summary-label">Ditolak</span>
                <span className="neon-summary-value">{summary.Ditolak}</span>
              </div>
            </div>
          </div>
          <div className="neon-recent-card">
            <h4>Riwayat Pengajuan Terakhir</h4>
            {recent.length === 0 ? (
              <div className="neon-recent-empty">Belum ada pengajuan surat</div>
            ) : (
              <table className="neon-recent-table">
                <thead>
                  <tr>
                    <th>Jenis</th>
                    <th>Keterangan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.jenisSurat}</td>
                      <td>{item.keterangan}</td>
                      <td>{new Date(item.tanggal).toLocaleDateString()}</td>
                      <td><span className="neon-status-badge" data-status={item.status}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="alur-card">
          <h3 className="alur-title">Contoh Alur Pengajuan Surat ke Desa</h3>
          <ol className="alur-steps">
            <li>
              <span className="alur-step-num">1</span>
              <span className="alur-step-text">Login ke aplikasi sebagai user</span>
            </li>
            <li>
              <span className="alur-step-num">2</span>
              <span className="alur-step-text">Klik <b>Ajukan Surat</b> dan isi formulir pengajuan sesuai kebutuhan</span>
            </li>
            <li>
              <span className="alur-step-num">3</span>
              <span className="alur-step-text">Tunggu proses verifikasi dan persetujuan dari admin desa</span>
            </li>
            <li>
              <span className="alur-step-num">4</span>
              <span className="alur-step-text">Cek status permohonan di menu <b>Lihat Permohonan Surat</b></span>
            </li>
            <li>
              <span className="alur-step-num">5</span>
              <span className="alur-step-text">Jika disetujui, unduh surat yang sudah jadi</span>
            </li>
          </ol>
        </div>
      </div>
      <style jsx>{`
        .neon-dashboard-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #232526 0%, #1a2980 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 8px;
          font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        }
        .neon-dashboard-wrapper {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .neon-dashboard-card {
          width: 100%;
          background: rgba(20,20,40,0.85);
          box-shadow: 0 0 32px 0 #00fff7cc, 0 8px 32px 0 #1a298088;
          border-radius: 28px;
          padding: 38px 28px 28px 28px;
          border: 2.5px solid #00fff7;
          text-align: center;
          animation: fadeInDash 1s cubic-bezier(.39,.575,.56,1) both;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .neon-dashboard-title {
          font-size: 2.1rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #fff;
          margin-bottom: 8px;
          text-shadow: 0 0 8px #00fff7, 0 2px 12px #0008;
        }
        .neon-dashboard-sub {
          color: #b2f7ff;
          font-size: 1.1rem;
          margin-bottom: 0;
          text-shadow: 0 0 4px #00fff7;
        }
        .neon-dashboard-actions {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-bottom: 0;
          flex-wrap: wrap;
        }
        .neon-btn {
          padding: 12px 28px;
          border-radius: 14px;
          border: 2px solid #00fff7;
          background: transparent;
          color: #00fff7;
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 0 8px #00fff7, 0 2px 8px #00fff733;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s;
          text-decoration: none;
          display: inline-block;
          outline: none;
        }
        .neon-btn-primary {
          background: linear-gradient(90deg, #00fff7 0%, #764ba2 100%);
          color: #232526;
          border: 2px solid #00fff7;
          box-shadow: 0 0 16px #00fff7, 0 2px 8px #764ba288;
        }
        .neon-btn:hover {
          background: #00fff7;
          color: #232526;
          box-shadow: 0 0 24px #00fff7, 0 2px 12px #00fff799;
          transform: scale(1.04);
        }
        .neon-btn-logout {
          background: linear-gradient(90deg,#e96443,#904e95);
          color: #fff;
          border: 2px solid #e96443;
          box-shadow: 0 0 12px #e96443, 0 2px 8px #904e9588;
        }
        .neon-btn-logout:hover {
          background: #fff;
          color: #e96443;
          box-shadow: 0 0 24px #e96443, 0 2px 12px #e9644399;
        }
        .neon-dashboard-feature-card {
          background: rgba(0,255,247,0.08);
          border-radius: 18px;
          padding: 22px 16px 12px 16px;
          margin-top: 0;
          box-shadow: 0 0 12px #00fff7cc;
          border: 1.5px solid #00fff7;
        }
        .neon-dashboard-feature-card h3 {
          color: #00fff7;
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 0 0 8px #00fff7;
        }
        .neon-dashboard-feature-card ul {
          color: #fff;
          text-align: left;
          margin: 0 auto;
          max-width: 320px;
          font-size: 1.01rem;
          padding-left: 18px;
        }
        .neon-dashboard-feature-card li {
          margin-bottom: 7px;
          text-shadow: 0 0 4px #00fff7;
        }
        .neon-dashboard-logout-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        @keyframes fadeInDash {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .alur-card {
          margin: 32px auto 0 auto;
          max-width: 520px;
          background: rgba(0,255,247,0.10);
          border-radius: 18px;
          box-shadow: 0 0 12px #00fff744;
          border: 1.5px solid #00fff7;
          padding: 24px 18px 18px 18px;
          text-align: left;
          animation: fadeInDash 1.2s 0.2s both;
        }
        .alur-title {
          color: #00fff7;
          font-size: 1.13rem;
          font-weight: 700;
          margin-bottom: 14px;
          text-align: center;
          text-shadow: 0 0 8px #00fff7;
        }
        .alur-steps {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .alur-steps li {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
        }
        .alur-step-num {
          display: inline-block;
          min-width: 32px;
          height: 32px;
          background: linear-gradient(135deg,#00fff7 60%,#764ba2 100%);
          color: #232526;
          font-weight: 800;
          font-size: 1.1rem;
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          box-shadow: 0 0 8px #00fff7aa;
        }
        .alur-step-text {
          color: #fff;
          font-size: 1.04rem;
        }
        .neon-dashboard-extras {
          display: flex;
          gap: 32px;
          margin: 36px auto 0 auto;
          max-width: 1100px;
          justify-content: center;
        }
        .neon-summary-card, .neon-recent-card {
          background: rgba(0,255,247,0.10);
          border-radius: 18px;
          box-shadow: 0 0 12px #00fff744;
          border: 1.5px solid #00fff7;
          padding: 22px 18px 18px 18px;
          min-width: 260px;
          max-width: 340px;
          flex: 1 1 320px;
        }
        .neon-summary-card h4, .neon-recent-card h4 {
          color: #00fff7;
          font-size: 1.08rem;
          font-weight: 700;
          margin-bottom: 14px;
          text-align: center;
          text-shadow: 0 0 8px #00fff7;
        }
        .neon-summary-row {
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }
        .neon-summary-item {
          flex: 1 1 0;
          border-radius: 12px;
          padding: 10px 0 6px 0;
          text-align: center;
          font-weight: 700;
          font-size: 1.08rem;
          box-shadow: 0 0 8px #00fff733;
        }
        .neon-summary-label {
          display: block;
          font-size: 0.98rem;
          margin-bottom: 2px;
        }
        .neon-summary-value {
          font-size: 1.18rem;
        }
        .neon-recent-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.98rem;
        }
        .neon-recent-table th, .neon-recent-table td {
          padding: 6px 8px;
          text-align: left;
        }
        .neon-recent-table th {
          color: #00fff7;
          font-weight: 700;
          background: rgba(0,255,247,0.08);
        }
        .neon-recent-table td {
          color: #fff;
          background: rgba(0,255,247,0.03);
        }
        .neon-status-badge {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.97rem;
          background: #222;
          color: #fff;
        }
        .neon-status-badge[data-status="Diajukan"] { background: #3498db; }
        .neon-status-badge[data-status="Diproses"] { background: #f1c40f; color: #222; }
        .neon-status-badge[data-status="Selesai"] { background: #2ecc71; }
        .neon-status-badge[data-status="Ditolak"] { background: #e74c3c; }
        .neon-recent-empty {
          color: #fff;
          text-align: center;
          font-style: italic;
          padding: 10px 0;
        }
        @media (max-width: 1100px) {
          .neon-dashboard-extras {
            flex-direction: column;
            gap: 18px;
            max-width: 98vw;
          }
        }
        @media (max-width: 900px) {
          .neon-dashboard-extras {
            flex-direction: column;
            gap: 18px;
            max-width: 98vw;
          }
        }
        @media (max-width: 700px) {
          .neon-dashboard-wrapper {
            max-width: 100vw;
            padding: 0 0px;
          }
          .neon-dashboard-card {
            padding: 18px 4px 12px 4px;
            border-radius: 16px;
            gap: 16px;
          }
          .neon-dashboard-title { font-size: 1.2rem; }
          .neon-dashboard-actions {
            flex-direction: column;
            gap: 10px;
          }
          .neon-btn, .neon-btn-primary {
            width: 100%;
            min-width: 0;
            font-size: 1rem;
            padding: 12px 0;
          }
          .neon-dashboard-feature-card {
            padding: 14px 6px 8px 6px;
            border-radius: 10px;
          }
          .neon-dashboard-logout-wrapper {
            margin-top: 18px;
          }
          .alur-card {
            max-width: 100vw;
            padding: 14px 4px 10px 4px;
            border-radius: 10px;
          }
          .alur-step-num {
            min-width: 26px;
            height: 26px;
            font-size: 0.98rem;
            line-height: 26px;
          }
          .alur-step-text {
            font-size: 0.97rem;
          }
          .neon-dashboard-extras {
            display: none;
          }
        }
      `}</style>
    </div>
  );
} 