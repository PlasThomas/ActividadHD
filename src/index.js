const express = require('express');
const mariadb = require('mariadb');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Conexión a MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',       // Reemplaza con tu usuario
  password: '123456', // Reemplaza con tu contraseña
  database: 'cesar'
});

// Ruta para guardar texto cifrado
app.post('/guardar', async (req, res) => {
  const { original, cifrado } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO cifrados (original, cifrado) VALUES (?, ?)",
      [original, cifrado]
    );
    conn.release();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
  
});

// Ruta para mostrar registros
app.get('/registros', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT id, original, cifrado, fecha FROM cifrados");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});