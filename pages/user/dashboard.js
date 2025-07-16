import { parse } from 'cookie';
import Link from 'next/link';
import Router from 'next/router';

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
  return { props: {} };
}

export default function UserDashboard() {
  // Logout handler
  const handleLogout = () => {
    document.cookie = 'user_auth=; Max-Age=0; path=/';
    Router.push('/');
  };

  return (
    <div className="user-dashboard-bg">
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 22px',
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(90deg,#e96443,#904e95)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0002',
            transition: 'background 0.2s',
            marginRight: 8,
          }}
        >
          Keluar
        </button>
      </div>
      <div className="user-dashboard-card">
        <h1 className="user-dashboard-title">👋 Selamat Datang di Dashboard User</h1>
        <p className="user-dashboard-sub">Aplikasi Pelayanan Surat Desa Karyalaksana</p>
        <div className="user-dashboard-actions">
          <Link href="/user/pengajuan" legacyBehavior>
            <a className="user-btn user-btn-primary">Ajukan Surat</a>
          </Link>
          <Link href="/user/daftar-permohonan" legacyBehavior>
            <a className="user-btn">Lihat Permohonan Surat</a>
          </Link>
        </div>
        <div className="user-dashboard-feature-card">
          <h3>✨ Fitur Dashboard User</h3>
          <ul>
            <li>Mengajukan permohonan surat secara online</li>
            <li>Melihat daftar & status permohonan surat</li>
            <li>Mendapatkan notifikasi status permohonan</li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .user-dashboard-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 8px;
        }
        .user-dashboard-card {
          max-width: 480px;
          width: 100%;
          background: rgba(255,255,255,0.15);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          padding: 38px 28px 28px 28px;
          border: 1.5px solid rgba(255,255,255,0.22);
          text-align: center;
          animation: fadeInDash 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .user-dashboard-title {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #fff;
          margin-bottom: 8px;
          text-shadow: 0 2px 12px #0002;
        }
        .user-dashboard-sub {
          color: #e0e7ff;
          font-size: 1.1rem;
          margin-bottom: 28px;
        }
        .user-dashboard-actions {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-bottom: 32px;
        }
        .user-btn {
          padding: 12px 28px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.22);
          color: #764ba2;
          font-weight: 700;
          font-size: 1.08rem;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 2px 8px #764ba222;
          transition: background 0.2s, color 0.2s, transform 0.1s;
          text-decoration: none;
          display: inline-block;
        }
        .user-btn-primary {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }
        .user-btn:hover {
          background: #fff;
          color: #764ba2;
          transform: scale(1.04);
        }
        .user-dashboard-feature-card {
          background: rgba(255,255,255,0.18);
          border-radius: 18px;
          padding: 22px 16px 12px 16px;
          margin-top: 10px;
          box-shadow: 0 2px 12px #764ba222;
        }
        .user-dashboard-feature-card h3 {
          color: #764ba2;
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .user-dashboard-feature-card ul {
          color: #222;
          text-align: left;
          margin: 0 auto;
          max-width: 320px;
          font-size: 1.01rem;
          padding-left: 18px;
        }
        .user-dashboard-feature-card li {
          margin-bottom: 7px;
        }
        @keyframes fadeInDash {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 600px) {
          .user-dashboard-card { padding: 18px 4px 12px 4px; }
          .user-dashboard-title { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
} 