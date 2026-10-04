import { Student } from './models/student.js';

console.log("=== INICIO DE PRUEBAS POO: ENTIDAD STUDENT ===");

const student1 = new Student(1, "Ana María Gómez", "ana.gomez@university.edu", "2002-05-14");

console.log("Información inicial del estudiante:", student1.getInfo());

console.log("Correo actual (vía getter):", student1.email);

student1.email = "ana.gomez.new@university.edu";
console.log("Nuevo correo actualizado:", student1.email);

student1.email = "correo-invalido-sin-arroba";

student1.updateStatus("GRADUATED");

console.log("Información final del estudiante:", student1.getInfo());
console.log("=== FIN DE PRUEBAS DÍA 2 ===");