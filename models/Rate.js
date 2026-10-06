import { numeroEntero, lanzarSiHayErrores } from '../utils/Validador.js';

export default class Rate {
  constructor({ id, inscription_id, rate, comments }) {
    this.id = id ?? null;
    this.inscription_id = inscription_id;
    this.rate = Number(rate);
    this.comments = comments ?? null;

    lanzarSiHayErrores('Rate', [
      !this.inscription_id ? 'inscription_id: requerido' : null,
      numeroEntero(this.rate, 'rate', { min: 0, max: 100 }),
      this.comments && this.comments.length > 250 ? 'comments: máx 250 caracteres' : null
    ]);
  }
}
