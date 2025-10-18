import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
const db = new sqlite3.Database('./database.db');

export async function openDb() {
  return open({
    filename: './turnos.db',
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS turnos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      horario TEXT NOT NULL,
      cancha TEXT NOT NULL,
      UNIQUE(fecha, horario, cancha)
    );
  `);
}
