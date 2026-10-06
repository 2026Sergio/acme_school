import pool from '../config/database.js';

/**
 * Patrón Repository + herencia: centraliza el CRUD genérico (listar, buscar,
 * eliminar) para que cada repositorio concreto solo escriba lo que es distinto
 * (su validación de modelo y su INSERT/UPDATE con sus propias columnas).
 */
export default class BaseRepository {
  constructor(tabla, pk) {
    this.tabla = tabla;
    this.pk = pk;
  }

  async listarTodos(orderBy = this.pk) {
    const [rows] = await pool.query(`SELECT * FROM ${this.tabla} ORDER BY ${orderBy}`);
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await pool.query(`SELECT * FROM ${this.tabla} WHERE ${this.pk} = ?`, [id]);
    return rows[0] || null;
  }

  async eliminar(id) {
    const existente = await this.buscarPorId(id);
    if (!existente) throw new Error(`No existe un registro de ${this.tabla} con id ${id}`);
    const [result] = await pool.query(`DELETE FROM ${this.tabla} WHERE ${this.pk} = ?`, [id]);
    return result.affectedRows > 0;
  }
}
