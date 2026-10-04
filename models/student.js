export class Student {
  #id;
  #email;

  constructor(id, fullName, email, birthDate) {
    this.#id = id;
    this.fullName = fullName;    
    this.#email = email;
    this.birthDate = birthDate;  
    this.status = 'ACTIVE';      
  }

  get id() {
    return this.#id;
  }

  get email() {
    return this.#email;
  }

  set email(newEmail) {
    if (typeof newEmail === 'string' && newEmail.includes('@')) {
      this.#email = newEmail;
    } else {
      console.warn(`[WARNING]: Correo electrónico inválido para el estudiante ${this.fullName}`);
    }
  }

  getInfo() {
    return {
      id: this.#id,
      fullName: this.fullName,
      email: this.#email,
      status: this.status
    };
  }

  updateStatus(newStatus) {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      console.log(`El estado del estudiante ${this.fullName} ha cambiado a: ${this.status}`);
    } else {
      console.error(`[ERROR]: Estado inválido -> ${newStatus}`);
    }
  }
}