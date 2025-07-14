import { parse } from 'cookie';
import Link from 'next/link';

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
  return (
    <div style={{ maxWidth: 600, margin: 'auto', marginTop: 60, textAlign: 'center' }}>
      <h1>Selamat datang di Dashboard User!</h1>
      <p>Anda dapat mengajukan surat dan melihat status permohonan surat Anda.</p>
      <div style={{ margin: '30px 0' }}>
        <Link href="/user/pengajuan"><button style={{ marginRight: 16 }}>Ajukan Surat</button></Link>
        <Link href="/user/daftar-permohonan"><button>Lihat Permohonan Surat</button></Link>
      </div>
      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8 }}>
        <h3>Fitur Dashboard User:</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Mengajukan permohonan surat secara online</li>
          <li>Melihat daftar dan status permohonan surat</li>
          <li>Mendapatkan notifikasi status permohonan</li>
        </ul>
      </div>
    </div>
  );
} 