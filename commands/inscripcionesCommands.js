import inquirer from 'inquirer';
import InscripcionService from '../services/InscripcionService.js';
import InscriptionRepository from '../repositories/InscriptionRepository.js';
import RateRepository from '../repositories/RateRepository.js';
import CourseScheduleRepository from '../repositories/CourseScheduleRepository.js';
import StudentRepository from '../repositories/StudentRepository.js';
import Consola from '../utils/Consola.js';

const inscripcionService = new InscripcionService();
const inscriptionRepo = new InscriptionRepository();
const rateRepo = new RateRepository();
const scheduleRepo = new CourseScheduleRepository();
const studentRepo = new StudentRepository();

async function inscribir() {
  Consola.titulo('Inscribir estudiante a un horario de curso');
  const horarios = await scheduleRepo.listarConDetalle();
  const estudiantes = await studentRepo.listarTodos();
  if (horarios.length === 0 || estudiantes.length === 0) {
    return Consola.error('Se necesita al menos un horario de curso y un estudiante.');
  }

  const { course_schedule_id, student_id } = await inquirer.prompt([
    { type: 'select', name: 'course_schedule_id', message: 'Horario de curso:', choices: horarios.map(h => ({ name: `#${h.id} - ${h.curso} con ${h.profesor} (${h.aula})`, value: h.id })) },
    { type: 'select', name: 'student_id', message: 'Estudiante:', choices: estudiantes.map(s => ({ name: `${s.firstName} ${s.lastName}`, value: s.id })) }
  ]);

  try {
    const r = await inscripcionService.inscribirEstudiante(course_schedule_id, student_id);
    Consola.exito(`Inscripción creada con id ${r.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function cancelar() {
  Consola.titulo('Cancelar inscripción (rollback de calificaciones)');
  const inscripciones = (await inscriptionRepo.listarConDetalle()).filter(i => i.active);
  if (inscripciones.length === 0) return Consola.info('No hay inscripciones activas.');

  const { id, confirmar } = await inquirer.prompt([
    { type: 'select', name: 'id', message: 'Inscripción a cancelar:', choices: inscripciones.map(i => ({ name: `#${i.id} - ${i.estudiante} - ${i.curso}`, value: i.id })) },
    { type: 'confirm', name: 'confirmar', message: 'Esto eliminará sus calificaciones. ¿Continuar?', default: false }
  ]);
  if (!confirmar) return Consola.info('Cancelado.');

  try {
    await inscripcionService.cancelarInscripcion(id);
    Consola.exito('Inscripción cancelada y calificaciones revertidas.');
  } catch (e) { Consola.error(e.message); }
}

async function registrarNota() {
  Consola.titulo('Registrar calificación');
  const inscripciones = (await inscriptionRepo.listarConDetalle()).filter(i => i.active);
  if (inscripciones.length === 0) return Consola.info('No hay inscripciones activas.');

  const { inscription_id } = await inquirer.prompt([{
    type: 'select', name: 'inscription_id', message: 'Inscripción:',
    choices: inscripciones.map(i => ({ name: `#${i.id} - ${i.estudiante} - ${i.curso}`, value: i.id }))
  }]);
  const datos = await inquirer.prompt([
    { type: 'number', name: 'rate', message: 'Calificación (0-100):' },
    { type: 'input', name: 'comments', message: 'Comentarios (opcional):' }
  ]);

  try {
    const r = await rateRepo.crear({ inscription_id, ...datos, comments: datos.comments || null });
    Consola.exito(`Calificación registrada con id ${r.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function consultarNotas() {
  const inscripciones = await inscriptionRepo.listarConDetalle();
  if (inscripciones.length === 0) return Consola.info('No hay inscripciones.');
  const { inscription_id } = await inquirer.prompt([{
    type: 'select', name: 'inscription_id', message: 'Inscripción:',
    choices: inscripciones.map(i => ({ name: `#${i.id} - ${i.estudiante} - ${i.curso}`, value: i.id }))
  }]);
  Consola.tabla(await rateRepo.listarPorInscripcion(inscription_id));
}

export async function menuInscripciones() {
  let salir = false;
  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'select', name: 'opcion', message: 'Inscripciones y Calificaciones',
      choices: [
        { name: 'Inscribir estudiante (valida cupo del aula)', value: 'inscribir' },
        { name: 'Listar inscripciones', value: 'listar' },
        { name: 'Cancelar inscripción', value: 'cancelar' },
        { name: 'Registrar calificación', value: 'registrarNota' },
        { name: 'Consultar calificaciones de una inscripción', value: 'consultarNotas' },
        { name: 'Volver al menú principal', value: 'volver' }
      ]
    }]);

    if (opcion === 'inscribir') await inscribir();
    else if (opcion === 'listar') Consola.tabla(await inscriptionRepo.listarConDetalle());
    else if (opcion === 'cancelar') await cancelar();
    else if (opcion === 'registrarNota') await registrarNota();
    else if (opcion === 'consultarNotas') await consultarNotas();
    else salir = true;
  }
}
