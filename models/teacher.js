import { User } from './user.js';

export class Teacher extends User {
  #teacherCode;

  constructor(id, fullName, document, email, teacherCode, specialty) {
    super(id, fullName, document, email);
    this.#teacherCode = teacherCode;
    this.specialty = specialty; 
  }

  get teacherCode() {
    return this.#teacherCode;
  }

  getRoleDetails() {
    return `Profesor titular de la especialidad [${this.specialty}] con código: ${this.#teacherCode}`;
  }

  assignGrade(student, grade) {
    console.log(`El profesor ${this.fullName} asignó la calificación ${grade} al estudiante ${student.fullName}`);
  }
}