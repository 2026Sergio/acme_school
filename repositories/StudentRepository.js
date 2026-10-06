import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.js';

export default class StudentRepository extends BaseRepository {
  constructor() { super('students', 'id'); }

  async crear(datos) {
    const s = new Student(datos);

    const [tipo] = await pool.query('SELECT id FROM identification_types WHERE id = ?', [s.identification_type_id]);
    if (tipo.length === 0) throw new Error(`No existe el tipo de identificación ${s.identification_type_id}`);
    if (s.city_id) {
      const [city] = await pool.query('SELECT id FROM cities WHERE id = ?', [s.city_id]);
      if (city.length === 0) throw new Error(`No existe la ciudad ${s.city_id}`);
    }

    const [result] = await pool.query(
      `INSERT INTO students (code, firstName, lastName, identification_type_id, identificationNumber, gender, birthdate, email, address, city_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.code, s.firstName, s.lastName, s.identification_type_id, s.identificationNumber, s.gender, s.birthdate, s.email, s.address, s.city_id]
    );
    return { ...s, id: result.insertId };
  }

  async actualizar(id, datosNuevos) {
    const existente = await this.buscarPorId(id);
    if (!existente) throw new Error(`No existe el estudiante ${id}`);
    const s = new Student({ ...existente, ...datosNuevos, id });
    await pool.query(
      `UPDATE students SET code=?, firstName=?, lastName=?, identification_type_id=?, identificationNumber=?, gender=?, birthdate=?, email=?, address=?, city_id=? WHERE id=?`,
      [s.code, s.firstName, s.lastName, s.identification_type_id, s.identificationNumber, s.gender, s.birthdate, s.email, s.address, s.city_id, id]
    );
    return s;
  }

  async listarConDetalle() {
    const [rows] = await pool.query(
      `SELECT s.*, it.name AS tipo_identificacion, c.name AS ciudad
       FROM students s
       JOIN identification_types it ON it.id = s.identification_type_id
       LEFT JOIN cities c ON c.id = s.city_id
       ORDER BY s.id`
    );
    return rows;
  }
}
