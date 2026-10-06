import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';

export default class InscriptionRepository extends BaseRepository {
  constructor() { super('inscriptions', 'id'); }

  async listarConDetalle() {
    const [rows] = await pool.query(
      `SELECT i.*, CONCAT(s.firstName, ' ', s.lastName) AS estudiante, co.code AS curso
       FROM inscriptions i
       JOIN students s ON s.id = i.student_id
       JOIN courses_schedules csch ON csch.id = i.course_schedule_id
       JOIN courses co ON co.id = csch.course_id
       ORDER BY i.id`
    );
    return rows;
  }
}
