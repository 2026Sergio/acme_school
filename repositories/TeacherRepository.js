import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import Teacher from '../models/Teacher.js';

export default class TeacherRepository extends BaseRepository {
  constructor() { super('teachers', 'id'); }

  async crear(datos) {
    const t = new Teacher(datos);

    const [tipo] = await pool.query('SELECT id FROM identification_types WHERE id = ?', [t.identification_type_id]);
    if (tipo.length === 0) throw new Error(`No existe el tipo de identificación ${t.identification_type_id}`);

    const [result] = await pool.query(
      `INSERT INTO teachers (firstName, lastName, identification_type_id, identificationNumber, email) VALUES (?, ?, ?, ?, ?)`,
      [t.firstName, t.lastName, t.identification_type_id, t.identificationNumber, t.email]
    );
    return { ...t, id: result.insertId };
  }

  async listarConTipo() {
    const [rows] = await pool.query(
      `SELECT t.*, it.name AS tipo_identificacion
       FROM teachers t JOIN identification_types it ON it.id = t.identification_type_id
       ORDER BY t.id`
    );
    return rows;
  }
}
