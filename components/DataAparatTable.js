import { useEffect, useState } from 'react';

export default function DataAparatTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nama: '', jabatan: '', nip: '', alamat: '' });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/aparat');
      const json = await res.json();
      if (res.ok) {
        setData(json.dataAparat || []);
      } else {
        setError(json.message || 'Gagal mengambil data');
      }
    } catch (e) {
      setError('Gagal mengambil data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { ...form, id: editId } : form;
    const res = await fetch('/api/aparat', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setForm({ nama: '', jabatan: '', nip: '', alamat: '' });
      setEditId(null);
      fetchData();
    } else {
      setError(json.message || 'Gagal simpan data');
    }
  };

  const handleEdit = item => {
    setForm({ nama: item.nama, jabatan: item.jabatan, nip: item.nip, alamat: item.alamat });
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!confirm('Hapus data ini?')) return;
    const res = await fetch('/api/aparat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="data-aparat-container">
      <div className="data-aparat-card">
        <h2 className="data-aparat-title">Data Aparat Desa</h2>
        <form className="data-aparat-form" onSubmit={handleSubmit} autoComplete="off">
          <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />
          <input name="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Jabatan" required />
          <input name="nip" value={form.nip} onChange={handleChange} placeholder="NIP" required />
          <input name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat" required />
          <button type="submit" className="btn-primary">{editId ? 'Update' : 'Tambah'}</button>
          {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm({ nama: '', jabatan: '', nip: '', alamat: '' }); }}>Batal</button>}
        </form>
        {error && <div className="data-aparat-error">{error}</div>}
        {loading ? <div className="data-aparat-loading">Memuat data...</div> : (
          <div className="table-wrapper">
            <table className="data-aparat-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>NIP</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">Belum ada data</td></tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.nama}</td>
                      <td>{item.jabatan}</td>
                      <td>{item.nip}</td>
                      <td>{item.alamat}</td>
                      <td>
                        <button className="btn-action" onClick={() => handleEdit(item)}>Edit</button>{' '}
                        <button className="btn-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style jsx>{`
        .data-aparat-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
          padding: 24px 0;
        }
        .data-aparat-card {
          width: 100%;
          max-width: 800px;
          background: rgba(255,255,255,0.18);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 32px 18px 24px 18px;
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .data-aparat-title {
          text-align: center;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 18px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .data-aparat-form {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .data-aparat-form input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #c7d2fe;
          background: rgba(255,255,255,0.7);
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .data-aparat-form input:focus {
          border: 1.5px solid #764ba2;
          background: #fff;
        }
        .btn-primary {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(118,75,162,0.12);
          transition: background 0.2s, transform 0.1s;
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .btn-secondary {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: #e0e7ff;
          color: #764ba2;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          margin-left: 4px;
        }
        .btn-action {
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: #6366f1;
          color: #fff;
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          margin-right: 4px;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-action:hover {
          background: #764ba2;
          transform: scale(1.04);
        }
        .btn-danger {
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: #ef4444;
          color: #fff;
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-danger:hover {
          background: #b91c1c;
          transform: scale(1.04);
        }
        .data-aparat-error {
          background: rgba(255,0,0,0.08);
          color: #d90429;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
          margin-bottom: 8px;
        }
        .data-aparat-loading {
          text-align: center;
          color: #6366f1;
          font-weight: 500;
          margin: 18px 0;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .data-aparat-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(118,75,162,0.08);
        }
        .data-aparat-table th, .data-aparat-table td {
          padding: 12px 10px;
          text-align: left;
        }
        .data-aparat-table th {
          background: #f3f4f6;
          color: #4b5563;
          font-weight: 600;
          font-size: 1rem;
        }
        .data-aparat-table tbody tr {
          transition: background 0.15s;
        }
        .data-aparat-table tbody tr:hover {
          background: #ede9fe;
        }
        .empty-row {
          text-align: center;
          color: #a1a1aa;
          font-style: italic;
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
        @media (max-width: 700px) {
          .data-aparat-card {
            padding: 18px 2px 12px 2px;
          }
          .data-aparat-table th, .data-aparat-table td {
            padding: 8px 4px;
            font-size: 0.98rem;
          }
        }
      `}</style>
    </div>
  );
} 