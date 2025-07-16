import DataPendudukTable from '../../components/DataPendudukTable';
import Link from 'next/link';

export default function DataPendudukAdminPage() {
  return (
    <div>
      <Link href="/admin/dashboard" legacyBehavior>
        <a style={{display:'inline-block',marginBottom:16,padding:'8px 18px',borderRadius:8,background:'#eee',color:'#333',textDecoration:'none',fontWeight:600,boxShadow:'0 2px 8px #0001'}}>← Kembali</a>
      </Link>
      <DataPendudukTable />
    </div>
  );
} 