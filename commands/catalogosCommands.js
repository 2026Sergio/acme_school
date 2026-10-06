import inquirer from 'inquirer';
import IdentificationTypeRepository from '../repositories/IdentificationTypeRepository.js';
import CityRepository from '../repositories/CityRepository.js';
import ClassroomRepository from '../repositories/ClassroomRepository.js';
import Consola from '../utils/Consola.js';

const tipoRepo = new IdentificationTypeRepository();
const cityRepo = new CityRepository();
const classroomRepo = new ClassroomRepository();

async function crearTipoIdentificacion() {
  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código (ej. CC):' },
    { type: 'input', name: 'name', message: 'Nombre:' },
    { type: 'input', name: 'description', message: 'Descripción (opcional):' }
  ]);
  try {
    const t = await tipoRepo.crear({ ...datos, description: datos.description || null });
    Consola.exito(`Tipo de identificación creado con id ${t.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function crearCiudad() {
  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código (ej. BOG):' },
    { type: 'input', name: 'name', message: 'Nombre:' }
  ]);
  try {
    const c = await cityRepo.crear(datos);
    Consola.exito(`Ciudad creada con id ${c.id}`);
  } catch (e) { Consola.error(e.message); }
}

async function crearAula() {
  const datos = await inquirer.prompt([
    { type: 'input', name: 'code', message: 'Código del aula:' },
    { type: 'input', name: 'description', message: 'Descripción (opcional):' },
    { type: 'number', name: 'capacity', message: 'Capacidad:' }
  ]);
  try {
    const c = await classroomRepo.crear({ ...datos, description: datos.description || null });
    Consola.exito(`Aula creada con id ${c.id}`);
  } catch (e) { Consola.error(e.message); }
}

export async function menuCatalogos() {
  let salir = false;
  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'select', name: 'opcion', message: 'Catálogos',
      choices: [
        { name: 'Listar tipos de identificación', value: 'listarTipos' },
        { name: 'Crear tipo de identificación', value: 'crearTipo' },
        { name: 'Listar ciudades', value: 'listarCiudades' },
        { name: 'Crear ciudad', value: 'crearCiudad' },
        { name: 'Listar aulas', value: 'listarAulas' },
        { name: 'Crear aula', value: 'crearAula' },
        { name: 'Volver al menú principal', value: 'volver' }
      ]
    }]);

    if (opcion === 'listarTipos') Consola.tabla(await tipoRepo.listarTodos());
    else if (opcion === 'crearTipo') await crearTipoIdentificacion();
    else if (opcion === 'listarCiudades') Consola.tabla(await cityRepo.listarTodos());
    else if (opcion === 'crearCiudad') await crearCiudad();
    else if (opcion === 'listarAulas') Consola.tabla(await classroomRepo.listarTodos());
    else if (opcion === 'crearAula') await crearAula();
    else salir = true;
  }
}
