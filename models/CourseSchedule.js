import { lanzarSiHayErrores } from '../utils/Validador.js';

export default class CourseSchedule {
  constructor({ id, course_id, teacher_id, classroom_id, start_date, end_date, active = 1 }) {
    this.id = id ?? null;
    this.course_id = course_id;
    this.teacher_id = teacher_id;
    this.classroom_id = classroom_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.active = active ? 1 : 0;

    const inicio = new Date(this.start_date);
    const fin = new Date(this.end_date);

    lanzarSiHayErrores('CourseSchedule', [
      !this.course_id ? 'course_id: requerido' : null,
      !this.teacher_id ? 'teacher_id: requerido' : null,
      !this.classroom_id ? 'classroom_id: requerido' : null,
      isNaN(inicio.getTime()) ? 'start_date: fecha inválida' : null,
      isNaN(fin.getTime()) ? 'end_date: fecha inválida' : null,
      (!isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && fin <= inicio) ? 'end_date: debe ser posterior a start_date' : null
    ]);
  }
}
