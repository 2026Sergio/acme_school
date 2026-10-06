import { lanzarSiHayErrores } from '../utils/Validador.js';

export default class Inscription {
  constructor({ id, course_schedule_id, student_id, register_date, active = 1 }) {
    this.id = id ?? null;
    this.course_schedule_id = course_schedule_id;
    this.student_id = student_id;
    this.register_date = register_date;
    this.active = active ? 1 : 0;

    lanzarSiHayErrores('Inscription', [
      !this.course_schedule_id ? 'course_schedule_id: requerido' : null,
      !this.student_id ? 'student_id: requerido' : null,
      isNaN(new Date(this.register_date).getTime()) ? 'register_date: fecha inválida' : null
    ]);
  }
}
