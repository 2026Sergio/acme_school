import pool from './config/database.js';

async function probarConexion() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    console.log('Conexión exitosa a MySQL! Resultado:', rows[0].resultado);
    process.exit(0);
  } catch (error) {
    console.error('Error al conectar a la base de datos:');
    console.error(error.message);
    process.exit(1);
  }
}

probarConexion();
