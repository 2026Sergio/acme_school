import { User } from './models/user.js';
import { Student } from './models/student.js';
import { Teacher } from './models/Teacher.js';

console.log("=== INICIO DE PRUEBAS DÍA 3: HERENCIA Y POLIMORFISMO ===");

try {
  const invalidUser = new User(0, "Prueba", "000000", "test@univ.edu");
} catch (error) {
  console.log(`[VALIDACIÓN CLASE ABSTRACTA]: ${error.message}`);
}
const student1 = new Student(1, "Carlos Pérez", "1098234567", "carlos.perez@univ.edu", "EST-2026-001");
const teacher1 = new Teacher(2, "Dra. Elena Vargas", "79123456", "elena.vargas@univ.edu", "DOC-2026-999", "Bases de Datos Relacionales");

const systemUsers = [student1, teacher1];

console.log("\n--- RECORRIENDO USUARIOS CON POLIMORFISMO ---");
systemUsers.forEach(user => {
  console.log(`- ${user.fullName} (${user.email}) -> ${user.getRoleDetails()}`);
});

console.log("\n--- ACCIONES ESPECÍFICAS ---");
student1.enrollCourse("Programación Backend I");
teacher1.assignGrade(student1, 95);

console.log("\n=== FIN DE PRUEBAS DÍA 3 ===");