import PDFDocument from 'pdfkit';

// Simulasi data permohonan surat (harusnya dari database)
let pengajuanSurat = [
  // Data akan diisi oleh API pengajuan_surat.js
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const surat = pengajuanSurat.find(s => s.id === Number(id));
  if (!surat) {
    return res.status(404).json({ message: 'Surat tidak ditemukan' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=surat_${id}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(18).text('Surat Keterangan', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Jenis Surat: ${surat.jenisSurat}`);
  doc.text(`Keterangan: ${surat.keterangan}`);
  doc.text(`Tanggal: ${new Date(surat.tanggal).toLocaleString()}`);
  doc.text(`Status: ${surat.status}`);
  doc.moveDown();
  doc.text('--- Tanda Tangan Kepala Desa ---', { align: 'right' });

  doc.end();
} 