import { useState } from 'react';

export default function FormPengajuanSurat() {
  const [jenisSurat, setJenisSurat] = useState('Keterangan');
  const [keterangan, setKeterangan] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    const res = await fetch('/api/pengajuan_surat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jenisSurat, keterangan }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Pengajuan surat berhasil!');
      setJenisSurat('Keterangan');
      setKeterangan('');
    } else {
      const data = await res.json();
      setError(data.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="pengajuan-form-container">
      <form className="pengajuan-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="pengajuan-title">Pengajuan Surat</h2>
        {success && <div className="pengajuan-success">{success}</div>}
        {error && <div className="pengajuan-error">{error}</div>}
        <div className="input-group">
          <label htmlFor="jenisSurat"><span className="icon">📄</span> Jenis Surat</label>
          <select
            id="jenisSurat"
            value={jenisSurat}
            onChange={e => setJenisSurat(e.target.value)}
            required
          >
            <option value="Keterangan">Keterangan</option>
            <option value="Domisili">Domisili</option>
            <option value="Usaha">Usaha</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="keterangan"><span className="icon">📝</span> Keterangan</label>
          <textarea
            id="keterangan"
            value={keterangan}
            onChange={e => setKeterangan(e.target.value)}
            required
            placeholder="Tuliskan keterangan surat yang diajukan..."
            rows={3}
          />
        </div>
        <button className="pengajuan-btn" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Ajukan Surat'}
        </button>
      </form>
      <style jsx>{`
        .pengajuan-form-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
          padding: 24px 0;
        }
        .pengajuan-form {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.15);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 36px 32px 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .pengajuan-title {
          text-align: center;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pengajuan-success {
          background: rgba(0,200,0,0.08);
          color: #059669;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
        }
        .pengajuan-error {
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
        .input-group select,
        .input-group textarea {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #c7d2fe;
          background: rgba(255,255,255,0.7);
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .input-group select:focus,
        .input-group textarea:focus {
          border: 1.5px solid #764ba2;
          background: #fff;
        }
        .pengajuan-btn {
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
        .pengajuan-btn:active {
          transform: scale(0.98);
        }
        .pengajuan-btn:disabled {
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
          .pengajuan-form {
            padding: 24px 10px 18px 10px;
          }
        }
      `}</style>
    </div>
  );
} 