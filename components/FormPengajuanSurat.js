import { useState } from 'react';

export default function FormPengajuanSurat() {
  const [jenisSurat, setJenisSurat] = useState('Keterangan');
  const [keterangan, setKeterangan] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const res = await fetch('/api/pengajuan_surat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jenisSurat, keterangan }),
    });
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <h2>Pengajuan Surat</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Jenis Surat</label>
        <select value={jenisSurat} onChange={e => setJenisSurat(e.target.value)} required>
          <option value="Keterangan">Keterangan</option>
          <option value="Domisili">Domisili</option>
          <option value="Usaha">Usaha</option>
        </select>
      </div>
      <div>
        <label>Keterangan</label>
        <textarea value={keterangan} onChange={e => setKeterangan(e.target.value)} required />
      </div>
      <button type="submit">Ajukan Surat</button>
    </form>
  );
} 