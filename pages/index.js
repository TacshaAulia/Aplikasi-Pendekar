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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'pulse 6s ease-in-out infinite reverse',
        zIndex: 1
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '40px 24px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInDown 1s ease-out'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            letterSpacing: '2px'
          }}>
            APLIKASI PENDEKAR
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            margin: '0',
            fontWeight: '300',
            letterSpacing: '1px'
          }}>
            Pelayanan Desa Karyalaksana • Sistem Digital Modern
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          animation: 'fadeInUp 1s ease-out 0.3s both'
        }}>
          {TABS.map((t, index) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '12px 24px',
                background: tab === t.key 
                  ? 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                  : 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: tab === t.key ? '600' : '400',
                fontSize: '14px',
                letterSpacing: '0.5px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: tab === t.key 
                  ? '0 8px 32px rgba(0,0,0,0.3)' 
                  : '0 4px 16px rgba(0,0,0,0.1)',
                transform: tab === t.key ? 'translateY(-2px)' : 'translateY(0)',
                animation: `fadeInUp 1s ease-out ${0.4 + index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                if (tab !== t.key) {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (tab !== t.key) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          maxWidth: '1000px',
          width: '100%',
          margin: 'auto',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 1s ease-out 0.6s both'
        }}>
          {TABS.find(t => t.key === tab)?.component}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 