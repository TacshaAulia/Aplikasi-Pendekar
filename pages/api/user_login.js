export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Daftar user yang valid
  const users = [
    {
      email: 'user@desa.com',
      password: 'user123', // sebaiknya di-hash di production!
    },
    {
      email: 'andi@gmail.com',
      password: 'andi123',
    },
  ];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Set cookie session sederhana
    res.setHeader('Set-Cookie', `user_auth=1; Path=/; HttpOnly; SameSite=Strict`);
    return res.status(200).json({ message: 'Login berhasil' });
  } else {
    return res.status(401).json({ message: 'Email atau password salah' });
  }
} 