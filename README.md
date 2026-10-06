## Acme_school

CLI en Node.js para gestionar una academia: tipos de identificación, ciudades,
aulas, profesores, estudiantes, cursos (con temas), horarios de curso,


## Instalación

```bash
npm install
cp .env.example .env            # edita con tu usuario/contraseña de MySQL
mysql -u root -p < database/academia_db.sql
npm run test:db                 # prueba la conexión
node pruebas_automaticas.js     # corre la suite de pruebas end-to-end
npm start                       # inicia el CLI
```

## Estructura

```
config/database.js        # Singleton: pool de conexiones MySQL
models/                   # Validación por campo de cada entidad
repositories/
  BaseRepository.js        # CRUD genérico (listar, buscar, eliminar) por herencia
  <Entidad>Repository.js    # crear/actualizar + queries propias de cada tabla
services/InscripcionService.js   # Acciones críticas con transacciones reales
commands/                 # Menús de consola (inquirer + chalk)
database/academia_db.sql  # Esquema + datos semilla
pruebas_automaticas.js    # Pruebas end-to-end contra la BD real
```

## Patrones y principios aplicados

- **Singleton** (`config/database.js`): un único pool de conexiones.
- **Repository + herencia** (`BaseRepository` y sus subclases): evita repetir el
  CRUD genérico en cada entidad (SRP + DRY).
- **SOLID**: cada repositorio solo conoce su tabla; los modelos solo validan;
  `InscripcionService` concentra las reglas de negocio críticas sin que los
  comandos de consola conozcan SQL.

## Transacciones reales (lo crítico del proyecto)

`services/InscripcionService.js` contiene las dos operaciones que requieren
consistencia garantizada:

1. **`inscribirEstudiante`**: antes de insertar la inscripción, bloquea con
   `FOR UPDATE` la fila del horario y cuenta las inscripciones activas contra
   la capacidad del aula. Si el aula está llena, se revierte sin dejar ninguna
   fila nueva (verificado en `pruebas_automaticas.js`, que llena un aula de
   capacidad 1 y confirma que la segunda inscripción se rechaza).
2. **`cancelarInscripcion`**: borra las calificaciones (`rates`) asociadas y
   marca la inscripción como inactiva, todo en una sola transacción — si algo
   falla a mitad de camino, no quedan calificaciones huérfanas.

## Validar que todo funciona

```bash
node pruebas_automaticas.js
```
Debe terminar con `TODAS LAS PRUEBAS PASARON (0 fallos)`. También puedes
validar manualmente con `npm start`, siguiendo el flujo: Catálogos → Profesores
y Estudiantes → Cursos (crear curso, tema, horario) → Inscripciones (inscribir,
registrar nota, cancelar).

## Autor:

Sergio Ricardo Ajú Miranda