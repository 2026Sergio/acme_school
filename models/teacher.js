import { requerido, email, lanzarSiHayErrores } from '../utils/Validador.js';

export default class Teacher {
  constructor({ id, firstName, lastName, identification_type_id, identificationNumber, email: correo }) {
    this.id = id ?? null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.identification_type_id = identification_type_id;
    this.identificationNumber = identificationNumber;
    this.email = correo;

    lanzarSiHayErrores('Teacher', [
      requerido(this.firstName, 'firstName', { min: 2, max: 60 }),
      requerido(this.lastName, 'lastName', { min: 2, max: 60 }),
      !this.identification_type_id ? 'identification_type_id: requerido' : null,
      requerido(this.identificationNumber, 'identificationNumber', { min: 5, max: 16 }),
      email(this.email, 'email')
    ]);
  }
}
