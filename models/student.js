import { User } from './user.js';

export class Student extends User {
  #studentCode;

  constructor(id, fullName, document, email, studentCode) {
    super(id, fullName, document, email);
    this.#studentCode = studentCode;
    this.status = 'ACTIVE';
  }

  get studentCode() {
    return this.#studentCode;
  }
  getRoleDetails() {
    return `Estudiante activo con código institucional: ${this.#studentCode}`;
  }

  enrollCourse(courseName) {
    console.log(`El estudiante ${this.fullName} se ha inscrito exitosamente en el curso: ${courseName}`);
  }
}