export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Contoh data admin (seharusnya dari database)
  const admin = {
    email: 'admin@desa.com',
    password: 'admin123', // sebaiknya di-hash di production!
  };

  if (email === admin.email && password === admin.password) {
    // Set cookie session sederhana
    res.setHeader('Set-Cookie', `admin_auth=1; Path=/; HttpOnly; SameSite=Strict`);
    return res.status(200).json({ message: 'Login berhasil' });
  } else {
    return res.status(401).json({ message: 'Email atau password salah' });
  }
} 