import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterUser() {
  const [form, setForm] = useState({ nama: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.nama || !form.email || !form.password || !form.confirm) {
      setError('Semua field wajib diisi!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama: form.nama, email: form.email, password: form.password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setTimeout(() => router.push('/'), 1500);
    } else {
      const data = await res.json();
      setError(data.message || 'Pendaftaran gagal!');
    }
  };

  return (
    <div className="register-user-container">
      <form className="register-user-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="register-title">Daftar Akun Baru</h2>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
        <div className="input-group">
          <label htmlFor="nama"><span className="icon">👤</span> Nama Lengkap</label>
          <input id="nama" name="nama" type="text" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap" />
        </div>
        <div className="input-group">
          <label htmlFor="email"><span className="icon">📧</span> Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="youremail@email.com" />
        </div>
        <div className="input-group">
          <label htmlFor="password"><span className="icon">🔒</span> Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Minimal 6 karakter" />
        </div>
        <div className="input-group">
          <label htmlFor="confirm"><span className="icon">🔒</span> Konfirmasi Password</label>
          <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} required placeholder="Ulangi password" />
        </div>
        <button className="register-btn" type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Daftar'}</button>
        <div className="register-link">Sudah punya akun?{' '}<a href="/" style={{ color: '#764ba2', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Login di sini</a></div>
      </form>
      <style jsx>{`
        .register-user-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }
        .register-user-form {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.15);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 36px 32px 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .register-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .register-error {
          background: rgba(255,0,0,0.08);
          color: #d90429;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
        }
        .register-success {
          background: rgba(0,200,0,0.08);
          color: #059669;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .icon {
          font-size: 1.1em;
        }
        .input-group input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #c7d2fe;
          background: rgba(255,255,255,0.7);
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .input-group input:focus {
          border: 1.5px solid #764ba2;
          background: #fff;
        }
        .register-btn {
          margin-top: 10px;
          padding: 12px 0;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(118,75,162,0.12);
          transition: background 0.2s, transform 0.1s;
        }
        .register-btn:active {
          transform: scale(0.98);
        }
        .register-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .register-link {
          text-align: center;
          margin-top: 8px;
          font-size: 0.98rem;
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
        @media (max-width: 500px) {
          .register-user-form {
            padding: 24px 10px 18px 10px;
          }
        }
      `}</style>
    </div>
  );
} 