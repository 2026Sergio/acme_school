import { requerido, lanzarSiHayErrores } from '../utils/Validador.js';

export default class Topic {
  constructor({ id, course_id, code, title, description, active = 1 }) {
    this.id = id ?? null;
    this.course_id = course_id;
    this.code = code;
    this.title = title;
    this.description = description ?? null;
    this.active = active ? 1 : 0;

    lanzarSiHayErrores('Topic', [
      !this.course_id ? 'course_id: requerido' : null,
      requerido(this.code, 'code', { min: 2, max: 10 }),
      requerido(this.title, 'title', { min: 2, max: 100 })
    ]);
  }
}
