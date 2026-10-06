import pool from '../config/database.js';

/**
 * ACCIÓN CRÍTICA 1 — inscribirEstudiante:
 * antes de insertar la inscripción hay que verificar que el aula del horario
 * todavía tenga cupo (capacity > inscripciones activas). Se hace con FOR UPDATE
 * dentro de una transacción para evitar que dos inscripciones simultáneas
 * sobrepasen el cupo (condición de carrera).
 *
 * ACCIÓN CRÍTICA 2 — cancelarInscripcion:
 * cancelar una inscripción borra también sus calificaciones (rollback), para no
 * dejar `rates` huérfanas apuntando a una inscripción inexistente/inactiva.
 */
export default class InscripcionService {
  async inscribirEstudiante(course_schedule_id, student_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [horarios] = await connection.query(
        `SELECT csch.*, cl.capacity FROM courses_schedules csch
         JOIN classrooms cl ON cl.id = csch.classroom_id
         WHERE csch.id = ? FOR UPDATE`,
        [course_schedule_id]
      );
      if (horarios.length === 0) throw new Error(`No existe el horario de curso ${course_schedule_id}`);
      const horario = horarios[0];
      if (!horario.active) throw new Error('Este horario de curso no está activo');

      const [estudiantes] = await connection.query('SELECT id FROM students WHERE id = ? FOR UPDATE', [student_id]);
      if (estudiantes.length === 0) throw new Error(`No existe el estudiante ${student_id}`);

      const [[{ ocupados }]] = await connection.query(
        `SELECT COUNT(*) AS ocupados FROM inscriptions WHERE course_schedule_id = ? AND active = 1`,
        [course_schedule_id]
      );
      if (ocupados >= horario.capacity) {
        throw new Error(`El aula ya está llena (capacidad ${horario.capacity}, ${ocupados} inscritos)`);
      }

      const [yaInscrito] = await connection.query(
        `SELECT id FROM inscriptions WHERE course_schedule_id = ? AND student_id = ? AND active = 1`,
        [course_schedule_id, student_id]
      );
      if (yaInscrito.length > 0) throw new Error('El estudiante ya está inscrito en este horario');

      const [result] = await connection.query(
        `INSERT INTO inscriptions (course_schedule_id, student_id, register_date, active) VALUES (?, ?, NOW(), 1)`,
        [course_schedule_id, student_id]
      );

      await connection.commit();
      return { id: result.insertId, course_schedule_id, student_id };
    } catch (error) {
      await connection.rollback();
      throw new Error(`Falló la inscripción (rollback aplicado): ${error.message}`);
    } finally {
      connection.release();
    }
  }

  async cancelarInscripcion(id_inscripcion) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [inscripciones] = await connection.query('SELECT * FROM inscriptions WHERE id = ? FOR UPDATE', [id_inscripcion]);
      if (inscripciones.length === 0) throw new Error(`No existe la inscripción ${id_inscripcion}`);
      if (!inscripciones[0].active) throw new Error('Esta inscripción ya está cancelada');

      await connection.query('DELETE FROM rates WHERE inscription_id = ?', [id_inscripcion]);
      await connection.query('UPDATE inscriptions SET active = 0 WHERE id = ?', [id_inscripcion]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error(`Falló la cancelación (rollback aplicado): ${error.message}`);
    } finally {
      connection.release();
    }
  }
}
