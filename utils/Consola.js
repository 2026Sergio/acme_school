import chalk from 'chalk';

export default class Consola {
  static titulo(t) { console.log('\n' + chalk.bold.cyan(`== ${t} ==`)); }
  static exito(t) { console.log(chalk.green(`✔ ${t}`)); }
  static error(t) { console.log(chalk.red(`✖ ${t}`)); }
  static info(t) { console.log(chalk.yellow(`ℹ ${t}`)); }
  static tabla(filas) {
    if (!filas || filas.length === 0) return Consola.info('No hay registros para mostrar.');
    console.table(filas);
  }
}
