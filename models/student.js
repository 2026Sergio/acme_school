import { requerido, enumerado, lanzarSiHayErrores } from '../utils/Validador.js';

const GENEROS_VALIDOS = ['masculino', 'femenino', 'otro'];

export default class Student {
  constructor({ id, code, firstName, lastName, identification_type_id, identificationNumber, gender, birthdate, email, address, city_id }) {
    this.id = id ?? null;
    this.code = code;
    this.firstName = firstName;
    this.lastName = lastName;
    this.identification_type_id = identification_type_id;
    this.identificationNumber = identificationNumber;
    this.gender = gender ?? null;
    this.birthdate = birthdate ? new Date(birthdate).toISOString().slice(0, 19).replace('T', ' ') : null;
    this.email = email ?? null;
    this.address = address ?? null;
    this.city_id = city_id ?? null;

    lanzarSiHayErrores('Student', [
      requerido(this.code, 'code', { min: 3, max: 14 }),
      requerido(this.firstName, 'firstName', { min: 2, max: 60 }),
      requerido(this.lastName, 'lastName', { min: 2, max: 60 }),
      !this.identification_type_id ? 'identification_type_id: requerido' : null,
      requerido(this.identificationNumber, 'identificationNumber', { min: 5, max: 16 }),
      this.gender ? enumerado(this.gender, 'gender', GENEROS_VALIDOS) : null,
      this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? 'email: formato inválido' : null
    ]);
  }
}

export { GENEROS_VALIDOS };
