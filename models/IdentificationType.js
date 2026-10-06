import { requerido, lanzarSiHayErrores } from '../utils/Validador.js';

export default class IdentificationType {
  constructor({ id, code, name, description }) {
    this.id = id ?? null;
    this.code = code;
    this.name = name;
    this.description = description ?? null;

    lanzarSiHayErrores('IdentificationType', [
      requerido(this.code, 'code', { min: 2, max: 6 }),
      requerido(this.name, 'name', { min: 3, max: 100 }),
      this.description && this.description.length > 250 ? 'description: máx 250 caracteres' : null
    ]);
  }
}
