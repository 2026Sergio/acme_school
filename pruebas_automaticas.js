import pool from './config/database.js';
import IdentificationTypeRepository from './repositories/IdentificationTypeRepository.js';
import CityRepository from './repositories/CityRepository.js';
import TeacherRepository from './repositories/TeacherRepository.js';
import StudentRepository from './repositories/StudentRepository.js';
import ClassroomRepository from './repositories/ClassroomRepository.js';
import CourseRepository from './repositories/CourseRepository.js';
import CourseScheduleRepository from './repositories/CourseScheduleRepository.js';
import InscripcionService from './services/InscripcionService.js';
import RateRepository from './repositories/RateRepository.js';

const tipoRepo = new IdentificationTypeRepository();
const cityRepo = new CityRepository();
const teacherRepo = new TeacherRepository();
const studentRepo = new StudentRepository();
const classroomRepo = new ClassroomRepository();
const courseRepo = new CourseRepository();
const scheduleRepo = new CourseScheduleRepository();
const inscripcionService = new InscripcionService();
const rateRepo = new RateRepository();

let fallos = 0;
function ok(m) { console.log('✔ ' + m); }
function fail(m, e) { fallos++; console.log('✖ ' + m + ' -> ' + e.message); }
const sufijo = String(Date.now()).slice(-6); // corto, para no exceder VARCHAR(10)/(14)/(16)

async function run() {
  // Catálogos existentes (sembrados por el .sql)
  const tipos = await tipoRepo.listarTodos();
  const ciudad = (await cityRepo.listarTodos())[0];
  ok(`Catálogos sembrados -> ${tipos.length} tipo(s) de identificación, ciudad "${ciudad.name}"`);

  // Aula con capacidad = 1 para forzar la prueba de cupo lleno
  const aulaChica = await classroomRepo.crear({ code: `AU${sufijo}`, description: 'Aula de prueba', capacity: 1, active: 1 });
  ok(`Aula de prueba creada (capacidad 1) -> id ${aulaChica.id}`);

  // Profesor
  const profesor = await teacherRepo.crear({
    firstName: 'Prueba', lastName: 'Docente', identification_type_id: tipos[0].id,
    identificationNumber: `DOC${sufijo}`, email: `docente${sufijo}@mail.com`
  });
  ok(`Profesor creado -> id ${profesor.id}`);

  // Validación: email inválido debe rechazarse
  try {
    await teacherRepo.crear({ firstName: 'X', lastName: 'Y', identification_type_id: tipos[0].id, identificationNumber: '999', email: 'no-es-email' });
    fail('Validación email inválido', new Error('no lanzó error'));
  } catch (e) { ok('Validación rechaza email inválido en Teacher'); }

  // Curso
  const curso = await courseRepo.crear({ code: `C${sufijo}`, description: 'Curso de prueba', intensity: 20, weight: 2 });
  ok(`Curso creado -> id ${curso.id}`);

  // Tema
  const tema = await courseRepo.agregarTema({ course_id: curso.id, code: 'T1', title: 'Introducción', description: null });
  ok(`Tema agregado -> id ${tema.id}`);

  // Horario de curso (profesor + aula chica + fechas)
  const horario = await scheduleRepo.crear({
    course_id: curso.id, teacher_id: profesor.id, classroom_id: aulaChica.id,
    start_date: '2026-10-01', end_date: '2026-11-01'
  });
  ok(`Horario de curso creado -> id ${horario.id}`);

  // Dos estudiantes
  const est1 = await studentRepo.crear({ code: `E1${sufijo}`, firstName: 'Ana', lastName: 'Prueba', identification_type_id: tipos[0].id, identificationNumber: `A${sufijo}`, city_id: ciudad.id });
  const est2 = await studentRepo.crear({ code: `E2${sufijo}`, firstName: 'Luis', lastName: 'Prueba', identification_type_id: tipos[0].id, identificationNumber: `L${sufijo}`, city_id: ciudad.id });
  ok(`Dos estudiantes creados -> ids ${est1.id}, ${est2.id}`);

  // Inscripción 1: debe funcionar (cupo 1/1)
  let inscripcion1;
  try {
    inscripcion1 = await inscripcionService.inscribirEstudiante(horario.id, est1.id);
    ok(`Inscripción 1 creada -> id ${inscripcion1.id} (aula ahora llena)`);
  } catch (e) { fail('Inscripción 1 (debía funcionar)', e); }

  // Inscripción 2: debe fallar porque el aula ya está llena (capacidad=1)
  try {
    await inscripcionService.inscribirEstudiante(horario.id, est2.id);
    fail('Inscripción 2 (debía rechazarse por cupo lleno)', new Error('no lanzó error'));
  } catch (e) { ok('Inscripción 2 rechazada correctamente: aula sin cupo (' + e.message.split(':').pop().trim().slice(0, 50) + ')'); }

  // Verificación de atomicidad: el rechazo no debe dejar una fila de inscripción huérfana
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM inscriptions WHERE course_schedule_id = ?', [horario.id]);
  if (total === 1) ok('Transacción de inscripción atómica: solo 1 inscripción quedó registrada');
  else fail('Atomicidad de inscripción', new Error(`se esperaba 1 inscripción, hay ${total}`));

  // Registrar calificación
  const nota = await rateRepo.crear({ inscription_id: inscripcion1.id, rate: 95, comments: 'Excelente' });
  ok(`Calificación registrada -> id ${nota.id}`);

  // Cancelar inscripción: debe borrar la calificación (rollback) y liberar el cupo
  try {
    await inscripcionService.cancelarInscripcion(inscripcion1.id);
    const notasRestantes = await rateRepo.listarPorInscripcion(inscripcion1.id);
    const inscActiva = await pool.query('SELECT active FROM inscriptions WHERE id = ?', [inscripcion1.id]).then(r => r[0][0]);
    if (notasRestantes.length === 0 && inscActiva.active === 0) {
      ok('Cancelación revierte calificaciones y marca la inscripción como inactiva');
    } else {
      fail('Verificación de cancelación', new Error('quedaron datos inconsistentes'));
    }
  } catch (e) { fail('Cancelar inscripción', e); }

  // Ahora sí debe poder inscribirse el segundo estudiante (se liberó el cupo)
  try {
    const inscripcion2 = await inscripcionService.inscribirEstudiante(horario.id, est2.id);
    ok(`Inscripción 2 ahora exitosa tras liberar cupo -> id ${inscripcion2.id}`);
  } catch (e) { fail('Inscripción 2 tras liberar cupo', e); }

  console.log('\n----------------------------------------');
  if (fallos === 0) console.log('TODAS LAS PRUEBAS PASARON (0 fallos)');
  else console.log(`${fallos} prueba(s) fallaron`);
  process.exit(fallos === 0 ? 0 : 1);
}

run();
