import { iniciarMenuPrincipal } from './commands/menuPrincipal.js';

iniciarMenuPrincipal().catch((error) => {
  console.error('Error fatal en la aplicación:', error.message);
  process.exit(1);
});
