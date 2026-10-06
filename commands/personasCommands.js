import inquirer from 'inquirer';
import TeacherRepository from '../repositories/TeacherRepository.js';
import StudentRepository from '../repositories/StudentRepository.js';
import IdentificationTypeRepository from '../repositories/IdentificationTypeRepository.js';
import CityRepository from '../repositories/CityRepository.js';
import { GENEROS_VALIDOS } from '../models/Student.js';
import Consola from '../utils/Consola.js';

const teacherRepo = new TeacherRepository();
const studentRepo = new StudentRepository();
const tipoRepo = new IdentificationTypeRepository();
const cityRepo = new CityRepository();

async function elegirTipoIdentificacion() {
  const tipos = await tipoRepo.listarTodos();
  if (tipos.length === 0) { Consola.error('Primero registra un tipo de identificación en Catálogos.'); return null; }
  const { id } = await inquirer.prompt([{
    type: 'select', name: 'id', message: 'Tipo de identificación:',
    choices: tipos.map(t => ({ name: `${t.code} - ${t.name}`, value: t.id }))
  }]);
  return id;
}

// Profesores
async function crearProfesor() {
  Consola.titulo('Registrar profesor');
  const identification_type_id = await elegirTipoIdentificacion();
  if (!identification_type_id) return;
  const datos = await inquirer.prompt([
    { type: 'input', name: 'firstName', message: 'Nombres:' },
    { type: 'input', name: 'lastName', message: 'Apellidos:' },
    { type: 'input', name: 'identificationNumber', message: 'Número de identificación:' },
    { type: 'input', name: 'email', message: 'Correo:' }
  ]);
  try {
    const t = await teacherRepo.crear({ ...datos, identification_type_id });
    Consola.exito(`Profesor creado con id ${t.id}`);
  } catch (e) { Consola.error(e.message); }
}

// Estudiantes
async function crearEstudiante() {
  Consola.titulo('Registrar estudiante');
  const identification_type_id = await elegirTipoIdentificacion();
  if (!identification_type_id) return;

  const ciudades = await cityRepo.listarTodos();
  const { city_id } = await inquirer.prompt([{
    type: 'select', name: 'city_id', message: 'Ciudad (opcional):',
    choices: [{ name: '(sin ciudad)', value: null }, ...ciudades.map(c => ({ name: c.name, value: c.id }))]
  }]);

  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código de estudiante:' },
    { type: 'input', name: 'firstName', message: 'Nombres:' },
    { type: 'input', name: 'lastName', message: 'Apellidos:' },
    { type: 'input', name: 'identificationNumber', message: 'Número de identificación:' },
    { type: 'select', name: 'gender', message: 'Género (opcional):', choices: [{ name: '(no especifica)', value: null }, ...GENEROS_VALIDOS] },
    { type: 'input', name: 'birthdate', message: 'Fecha de nacimiento (YYYY-MM-DD, opcional):' },
    { type: 'input', name: 'email', message: 'Correo (opcional):' },
    { type: 'input', name: 'address', message: 'Dirección (opcional):' }
  ]);

  try {
    const s = await studentRepo.crear({
      ...datos, identification_type_id, city_id,
      birthdate: datos.birthdate || null, email: datos.email || null, address: datos.address || null
    });
    Consola.exito(`Estudiante creado con id ${s.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function listarEstudiantes() {
  Consola.titulo('Listado de estudiantes');
  Consola.tabla((await studentRepo.listarConDetalle()).map(s => ({
    id: s.id, codigo: s.code, nombre: `${s.firstName} ${s.lastName}`, email: s.email, ciudad: s.ciudad ?? '-'
  })));
}

async function eliminarEstudiante() {
  const estudiantes = await studentRepo.listarTodos();
  if (estudiantes.length === 0) return Consola.info('No hay estudiantes.');
  const { id, confirmar } = await inquirer.prompt([
    { type: 'select', name: 'id', message: 'Estudiante a eliminar:', choices: estudiantes.map(s => ({ name: `${s.id} - ${s.firstName} ${s.lastName}`, value: s.id })) },
    { type: 'confirm', name: 'confirmar', message: '¿Confirma?', default: false }
  ]);
  if (!confirmar) return Consola.info('Cancelado.');
  try {
    await studentRepo.eliminar(id);
    Consola.exito('Estudiante eliminado.');
  } catch (e) { Consola.error(e.message); }
}

export async function menuPersonas() {
  let salir = false;
  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'select', name: 'opcion', message: 'Profesores y Estudiantes',
      choices: [
        { name: 'Registrar profesor', value: 'crearProfesor' },
        { name: 'Listar profesores', value: 'listarProfesores' },
        { name: 'Registrar estudiante', value: 'crearEstudiante' },
        { name: 'Listar estudiantes', value: 'listarEstudiantes' },
        { name: 'Eliminar estudiante', value: 'eliminarEstudiante' },
        { name: 'Volver al menú principal', value: 'volver' }
      ]
    }]);

    if (opcion === 'crearProfesor') await crearProfesor();
    else if (opcion === 'listarProfesores') Consola.tabla(await teacherRepo.listarConTipo());
    else if (opcion === 'crearEstudiante') await crearEstudiante();
    else if (opcion === 'listarEstudiantes') await listarEstudiantes();
    else if (opcion === 'eliminarEstudiante') await eliminarEstudiante();
    else salir = true;
  }
}
