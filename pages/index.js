import { useState } from 'react';
import UserLoginForm from '../components/UserLoginForm';
import AdminLoginForm from '../components/AdminLoginForm';
import DaftarPengajuanSurat from '../components/DaftarPengajuanSurat';
import FormPengajuanSurat from '../components/FormPengajuanSurat';

const TABS = [
  { key: 'user', label: 'Login User', component: <UserLoginForm /> },
  { key: 'admin', label: 'Login Admin', component: <AdminLoginForm /> },
  { key: 'daftar', label: 'Daftar Pengajuan Surat', component: <DaftarPengajuanSurat /> },
  { key: 'form', label: 'Form Pengajuan Surat', component: <FormPengajuanSurat /> },
];

export default function Home() {
  const [tab, setTab] = useState('user');

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#f7f7f7' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Aplikasi Pendekar</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 16px',
              background: tab === t.key ? '#0070f3' : '#fff',
              color: tab === t.key ? '#fff' : '#0070f3',
              border: '1px solid #0070f3',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: tab === t.key ? 'bold' : 'normal',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', maxWidth: 900, margin: 'auto', padding: 24 }}>
        {TABS.find(t => t.key === tab)?.component}
      </div>
    </div>
  );
} 