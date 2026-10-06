import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import CourseSchedule from '../models/CourseSchedule.js';

export default class CourseScheduleRepository extends BaseRepository {
  constructor() { super('courses_schedules', 'id'); }

  async crear(datos) {
    const cs = new CourseSchedule(datos);

    const [[curso]] = [await pool.query('SELECT id FROM courses WHERE id = ?', [cs.course_id]).then(r => r[0])];
    if (!curso) throw new Error(`No existe el curso ${cs.course_id}`);
    const [[profesor]] = [await pool.query('SELECT id FROM teachers WHERE id = ?', [cs.teacher_id]).then(r => r[0])];
    if (!profesor) throw new Error(`No existe el profesor ${cs.teacher_id}`);
    const [[aula]] = [await pool.query('SELECT id FROM classrooms WHERE id = ?', [cs.classroom_id]).then(r => r[0])];
    if (!aula) throw new Error(`No existe el aula ${cs.classroom_id}`);

    const [result] = await pool.query(
      `INSERT INTO courses_schedules (course_id, teacher_id, classroom_id, start_date, end_date, active) VALUES (?, ?, ?, ?, ?, ?)`,
      [cs.course_id, cs.teacher_id, cs.classroom_id, cs.start_date, cs.end_date, cs.active]
    );
    return { ...cs, id: result.insertId };
  }

  async listarConDetalle() {
    const [rows] = await pool.query(
      `SELECT csch.*, co.code AS curso, co.description AS curso_desc,
              CONCAT(t.firstName, ' ', t.lastName) AS profesor,
              cl.code AS aula, cl.capacity AS capacidad_aula
       FROM courses_schedules csch
       JOIN courses co ON co.id = csch.course_id
       JOIN teachers t ON t.id = csch.teacher_id
       JOIN classrooms cl ON cl.id = csch.classroom_id
       ORDER BY csch.id`
    );
    return rows;
  }
}
