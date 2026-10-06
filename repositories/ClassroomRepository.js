import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import Classroom from '../models/Classroom.js';

export default class ClassroomRepository extends BaseRepository {
  constructor() { super('classrooms', 'id'); }

  async crear(datos) {
    const c = new Classroom(datos);
    const [result] = await pool.query(
      `INSERT INTO classrooms (code, description, capacity, active) VALUES (?, ?, ?, ?)`,
      [c.code, c.description, c.capacity, c.active]
    );
    return { ...c, id: result.insertId };
  }
}
