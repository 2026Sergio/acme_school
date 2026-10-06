import inquirer from 'inquirer';
import chalk from 'chalk';
import { menuCatalogos } from './catalogosCommands.js';
import { menuPersonas } from './personasCommands.js';
import { menuCursos } from './cursosCommands.js';
import { menuInscripciones } from './inscripcionesCommands.js';

export async function iniciarMenuPrincipal() {
  console.log(chalk.bold.magenta('\n=== Academia CLI ===\n'));

  let salir = false;
  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'select', name: 'opcion', message: 'Menú principal',
      choices: [
        { name: '1) Catálogos (tipos de identificación, ciudades, aulas)', value: 'catalogos' },
        { name: '2) Profesores y Estudiantes', value: 'personas' },
        { name: '3) Cursos, Temas y Horarios', value: 'cursos' },
        { name: '4) Inscripciones y Calificaciones', value: 'inscripciones' },
        { name: 'Salir', value: 'salir' }
      ]
    }]);

    if (opcion === 'catalogos') await menuCatalogos();
    else if (opcion === 'personas') await menuPersonas();
    else if (opcion === 'cursos') await menuCursos();
    else if (opcion === 'inscripciones') await menuInscripciones();
    else salir = true;
  }

  console.log(chalk.bold.magenta('\n¡Hasta luego!\n'));
  process.exit(0);
}
