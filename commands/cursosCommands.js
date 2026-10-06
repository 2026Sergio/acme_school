import inquirer from 'inquirer';
import dayjs from 'dayjs';
import CourseRepository from '../repositories/CourseRepository.js';
import CourseScheduleRepository from '../repositories/CourseScheduleRepository.js';
import TeacherRepository from '../repositories/TeacherRepository.js';
import ClassroomRepository from '../repositories/ClassroomRepository.js';
import Consola from '../utils/Consola.js';

const courseRepo = new CourseRepository();
const scheduleRepo = new CourseScheduleRepository();
const teacherRepo = new TeacherRepository();
const classroomRepo = new ClassroomRepository();

async function crearCurso() {
  Consola.titulo('Crear curso');
  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código del curso:' },
    { type: 'input', name: 'description', message: 'Descripción:' },
    { type: 'number', name: 'intensity', message: 'Intensidad horaria:' },
    { type: 'number', name: 'weight', message: 'Peso/créditos:' }
  ]);
  try {
    const c = await courseRepo.crear(datos);
    Consola.exito(`Curso creado con id ${c.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function agregarTema() {
  const cursos = await courseRepo.listarTodos();
  if (cursos.length === 0) return Consola.info('No hay cursos registrados.');
  const { course_id } = await inquirer.prompt([{
    type: 'select', name: 'course_id', message: 'Curso:',
    choices: cursos.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }))
  }]);
  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código del tema:' },
    { type: 'input', name: 'title', message: 'Título:' },
    { type: 'input', name: 'description', message: 'Descripción (opcional):' }
  ]);
  try {
    const t = await courseRepo.agregarTema({ ...datos, course_id, description: datos.description || null });
    Consola.exito(`Tema creado con id ${t.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function listarTemas() {
  const cursos = await courseRepo.listarTodos();
  if (cursos.length === 0) return Consola.info('No hay cursos registrados.');
  const { course_id } = await inquirer.prompt([{
    type: 'select', name: 'course_id', message: 'Curso:',
    choices: cursos.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }))
  }]);
  Consola.tabla(await courseRepo.listarTemas(course_id));
}

// Crear horario (sección) de un curso: profesor + aula + fechas
async function crearHorario() {
  Consola.titulo('Programar horario de curso');
  const cursos = await courseRepo.listarTodos();
  const profesores = await teacherRepo.listarTodos();
  const aulas = await classroomRepo.listarTodos();
  if (cursos.length === 0 || profesores.length === 0 || aulas.length === 0) {
    return Consola.error('Se necesita al menos un curso, un profesor y un aula.');
  }

  const respuestas = await inquirer.prompt([
    { type: 'select', name: 'course_id', message: 'Curso:', choices: cursos.map(c => ({ name: c.code, value: c.id })) },
    { type: 'select', name: 'teacher_id', message: 'Profesor:', choices: profesores.map(t => ({ name: `${t.firstName} ${t.lastName}`, value: t.id })) },
    { type: 'select', name: 'classroom_id', message: 'Aula:', choices: aulas.map(a => ({ name: `${a.code} (cap. ${a.capacity})`, value: a.id })) },
    { type: 'input', name: 'start_date', message: 'Fecha de inicio (YYYY-MM-DD):', default: dayjs().format('YYYY-MM-DD') },
    { type: 'input', name: 'end_date', message: 'Fecha de fin (YYYY-MM-DD):', default: dayjs().add(4, 'week').format('YYYY-MM-DD') }
  ]);

  try {
    const horario = await scheduleRepo.crear(respuestas);
    Consola.exito(`Horario de curso creado con id ${horario.id}`);
  } catch (e) { Consola.error(e.message); }
}

export async function menuCursos() {
  let salir = false;
  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'select', name: 'opcion', message: 'Cursos',
      choices: [
        { name: 'Crear curso', value: 'crearCurso' },
        { name: 'Listar cursos', value: 'listarCursos' },
        { name: 'Agregar tema a un curso', value: 'agregarTema' },
        { name: 'Listar temas de un curso', value: 'listarTemas' },
        { name: 'Programar horario de curso (profesor + aula + fechas)', value: 'crearHorario' },
        { name: 'Listar horarios programados', value: 'listarHorarios' },
        { name: 'Volver al menú principal', value: 'volver' }
      ]
    }]);

    if (opcion === 'crearCurso') await crearCurso();
    else if (opcion === 'listarCursos') Consola.tabla(await courseRepo.listarTodos());
    else if (opcion === 'agregarTema') await agregarTema();
    else if (opcion === 'listarTemas') await listarTemas();
    else if (opcion === 'crearHorario') await crearHorario();
    else if (opcion === 'listarHorarios') Consola.tabla(await scheduleRepo.listarConDetalle());
    else salir = true;
  }
}
