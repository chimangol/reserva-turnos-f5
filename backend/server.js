import express from 'express';
import cors from 'cors';
import { openDb, initDb } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

await initDb();

app.get('/api/turnos', async (req, res) => {
  const { fecha, cancha } = req.query;
  const db = await openDb();
  const turnos = await db.all('SELECT * FROM turnos WHERE fecha = ? AND cancha = ?', [fecha, cancha]);
  res.json(turnos);
});

app.post('/api/turnos', async (req, res) => {
  const { fecha, horario, cancha } = req.body;
  const db = await openDb();
  try {
    await db.run('INSERT INTO turnos (fecha, horario, cancha) VALUES (?, ?, ?)', [fecha, horario, cancha]);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Turno ya agendado' });
  }
});

app.delete('/api/turnos', async (req, res) => {
  const { fecha, horario, cancha } = req.body;
  const db = await openDb();
  await db.run('DELETE FROM turnos WHERE fecha = ? AND horario = ? AND cancha = ?', [fecha, horario, cancha]);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
