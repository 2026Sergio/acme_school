import { requerido, numeroEntero, lanzarSiHayErrores } from '../utils/Validador.js';

export default class Classroom {
  constructor({ id, code, description, capacity, active = 1 }) {
    this.id = id ?? null;
    this.code = code;
    this.description = description ?? null;
    this.capacity = Number(capacity);
    this.active = active ? 1 : 0;

    lanzarSiHayErrores('Classroom', [
      requerido(this.code, 'code', { min: 2, max: 10 }),
      numeroEntero(this.capacity, 'capacity', { min: 1, max: 1000 })
    ]);
  }
}
