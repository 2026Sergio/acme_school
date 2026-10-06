import { requerido, lanzarSiHayErrores } from '../utils/Validador.js';

export default class City {
  constructor({ id, code, name }) {
    this.id = id ?? null;
    this.code = code;
    this.name = name;

    lanzarSiHayErrores('City', [
      requerido(this.code, 'code', { min: 2, max: 10 }),
      requerido(this.name, 'name', { min: 2, max: 100 })
    ]);
  }
}
