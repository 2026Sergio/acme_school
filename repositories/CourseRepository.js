import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import Course from '../models/Course.js';
import Topic from '../models/Topic.js';

export default class CourseRepository extends BaseRepository {
  constructor() { super('courses', 'id'); }

  async crear(datos) {
    const c = new Course(datos);
    const [result] = await pool.query(
      `INSERT INTO courses (code, description, intensity, weight, active) VALUES (?, ?, ?, ?, ?)`,
      [c.code, c.description, c.intensity, c.weight, c.active]
    );
    return { ...c, id: result.insertId };
  }

  // HU - registrar temas (syllabus) de un curso
  async agregarTema(datos) {
    const topic = new Topic(datos);
    const [curso] = await pool.query('SELECT id FROM courses WHERE id = ?', [topic.course_id]);
    if (curso.length === 0) throw new Error(`No existe el curso ${topic.course_id}`);

    const [result] = await pool.query(
      `INSERT INTO topics (course_id, code, title, description, active) VALUES (?, ?, ?, ?, ?)`,
      [topic.course_id, topic.code, topic.title, topic.description, topic.active]
    );
    return { ...topic, id: result.insertId };
  }

  async listarTemas(course_id) {
    const [rows] = await pool.query('SELECT * FROM topics WHERE course_id = ? ORDER BY id', [course_id]);
    return rows;
  }
}
