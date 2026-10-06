import { requerido, numeroEntero, lanzarSiHayErrores } from '../utils/Validador.js';

export default class Course {
  constructor({ id, code, description, intensity, weight, active = 1 }) {
    this.id = id ?? null;
    this.code = code;
    this.description = description ?? null;
    this.intensity = intensity == null ? null : Number(intensity);
    this.weight = weight == null ? null : Number(weight);
    this.active = active ? 1 : 0;

    lanzarSiHayErrores('Course', [
      requerido(this.code, 'code', { min: 2, max: 10 }),
      this.intensity != null ? numeroEntero(this.intensity, 'intensity', { min: 1, max: 1000 }) : null,
      this.weight != null ? numeroEntero(this.weight, 'weight', { min: 1, max: 100 }) : null
    ]);
  }
}
