import { parse } from 'cookie';

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
  return <h1>Selamat datang, Admin!</h1>;
} 