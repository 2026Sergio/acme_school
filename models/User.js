export class User {
  #id;
  #document;

  constructor(id, fullName, document, email) {
    if (this.constructor === User) {
      throw new Error("No se puede instanciar la clase abstracta 'User' directamente.");
    }
    this.#id = id;
    this.fullName = fullName;
    this.#document = document;
    this.email = email;
    this.createdAt = new Date();
  }

  get id() {
    return this.#id;
  }

  get document() {
    return this.#document;
  }

  getRoleDetails() {
    return `Usuario genérico del sistema con ID: ${this.#id}`;
  }

  getInfo() {
    return {
      id: this.#id,
      fullName: this.fullName,
      document: this.#document,
      email: this.email,
      roleDetails: this.getRoleDetails()
    };
  }
}