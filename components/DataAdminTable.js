import { useEffect, useState } from 'react';

export default function DataAdminTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', nama: '' });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (res.ok) {
        setData(json.dataAdmin || []);
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
    const res = await fetch('/api/admin', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setForm({ email: '', nama: '' });
      setEditId(null);
      fetchData();
    } else {
      setError(json.message || 'Gagal simpan data');
    }
  };

  const handleEdit = item => {
    setForm({ email: item.email, nama: item.nama });
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!confirm('Hapus admin ini?')) return;
    const res = await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="data-admin-container">
      <div className="data-admin-card">
        <h2 className="data-admin-title">Data Akun Administrator</h2>
        <form className="data-admin-form" onSubmit={handleSubmit} autoComplete="off">
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama" required />
          <button type="submit" className="btn-primary">{editId ? 'Update' : 'Tambah'}</button>
          {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm({ email: '', nama: '' }); }}>Batal</button>}
      </form>
        {error && <div className="data-admin-error">{error}</div>}
        {loading ? <div className="data-admin-loading">Memuat data...</div> : (
          <div className="table-wrapper">
            <table className="data-admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Nama</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
                  <tr><td colSpan="4" className="empty-row">Belum ada data</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.email}</td>
                  <td>{item.nama}</td>
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
        .data-admin-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
          padding: 24px 0;
        }
        .data-admin-card {
          width: 100%;
          max-width: 700px;
          background: rgba(255,255,255,0.18);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 32px 18px 24px 18px;
          animation: fadeInLogin 1s cubic-bezier(.39,.575,.56,1) both;
        }
        .data-admin-title {
          text-align: center;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 18px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .data-admin-form {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .data-admin-form input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #c7d2fe;
          background: rgba(255,255,255,0.7);
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .data-admin-form input:focus {
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
        .data-admin-error {
          background: rgba(255,0,0,0.08);
          color: #d90429;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: center;
          font-size: 0.98rem;
          margin-bottom: 8px;
        }
        .data-admin-loading {
          text-align: center;
          color: #6366f1;
          font-weight: 500;
          margin: 18px 0;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .data-admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(118,75,162,0.08);
        }
        .data-admin-table th, .data-admin-table td {
          padding: 12px 10px;
          text-align: left;
        }
        .data-admin-table th {
          background: #f3f4f6;
          color: #4b5563;
          font-weight: 600;
          font-size: 1rem;
        }
        .data-admin-table tbody tr {
          transition: background 0.15s;
        }
        .data-admin-table tbody tr:hover {
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
          .data-admin-card {
            padding: 18px 2px 12px 2px;
          }
          .data-admin-table th, .data-admin-table td {
            padding: 8px 4px;
            font-size: 0.98rem;
          }
        }
      `}</style>
    </div>
  );
} 