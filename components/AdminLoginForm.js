import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="login-admin-container">
      <form className="login-admin-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="login-title">Login Admin</h2>
        {error && <div className="login-error">{error}</div>}
        <div className="input-group">
          <label htmlFor="email">
            <span className="icon">📧</span> Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="admin@email.com"
            autoFocus
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">
            <span className="icon">🔒</span> Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
      <style jsx>{`
        .login-admin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        .login-admin-form {
          width: 100%;
          max-width: 370px;
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
        .login-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-error {
          background: rgba(255,0,0,0.08);
          color: #d90429;
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
        .login-btn {
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
        .login-btn:active {
          transform: scale(0.98);
        }
        .login-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
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
          .login-admin-form {
            padding: 24px 10px 18px 10px;
          }
        }
      `}</style>
    </div>
  );
}
