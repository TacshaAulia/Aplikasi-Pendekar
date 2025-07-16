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
    <div className="neon-pengajuan-form-bg">
      <form className="neon-pengajuan-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="neon-pengajuan-title">Pengajuan Surat</h2>
        {success && <div className="neon-pengajuan-success">{success}</div>}
        {error && <div className="neon-pengajuan-error">{error}</div>}
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
        <button className="neon-pengajuan-btn" type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Ajukan Surat'}
        </button>
      </form>
      <style jsx>{`
        .neon-pengajuan-form-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #232526 0%, #1a2980 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 8px;
        }
        .neon-pengajuan-form {
          width: 100%;
          max-width: 420px;
          background: rgba(20,20,40,0.85);
          box-shadow: 0 0 32px 0 #00fff7cc, 0 8px 32px 0 #1a298088;
          border-radius: 24px;
          border: 2.5px solid #00fff7;
          padding: 38px 28px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
        }
        .neon-pengajuan-title {
          text-align: center;
          font-size: 1.7rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #fff;
          text-shadow: 0 0 8px #00fff7, 0 2px 12px #0008;
        }
        .neon-pengajuan-success {
          background: #2ecc7122;
          color: #2ecc71;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
          box-shadow: 0 0 8px #2ecc7144;
        }
        .neon-pengajuan-error {
          background: #e74c3c22;
          color: #e74c3c;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
          box-shadow: 0 0 8px #e74c3c44;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 1rem;
          font-weight: 500;
          color: #00fff7;
          display: flex;
          align-items: center;
          gap: 6px;
          text-shadow: 0 0 4px #00fff7;
        }
        .icon {
          font-size: 1.1em;
        }
        .input-group select,
        .input-group textarea {
          padding: 10px 14px;
          border-radius: 10px;
          border: 2px solid #00fff7;
          background: rgba(0,255,247,0.08);
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s, background 0.2s;
        }
        .input-group select:focus,
        .input-group textarea:focus {
          border: 2px solid #764ba2;
          background: #232526;
        }
        .neon-pengajuan-btn {
          margin-top: 10px;
          padding: 12px 0;
          border-radius: 12px;
          border: 2px solid #00fff7;
          background: linear-gradient(90deg, #00fff7 0%, #764ba2 100%);
          color: #232526;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 0 16px #00fff7, 0 2px 8px #764ba288;
          transition: background 0.2s, color 0.2s, transform 0.1s;
        }
        .neon-pengajuan-btn:active {
          transform: scale(0.98);
        }
        .neon-pengajuan-btn:disabled {
          background: #a5b4fc;
          color: #888;
          cursor: not-allowed;
        }
        @media (max-width: 500px) {
          .neon-pengajuan-form {
            padding: 18px 4px 12px 4px;
            border-radius: 14px;
          }
        }
      `}</style>
    </div>
  );
} 