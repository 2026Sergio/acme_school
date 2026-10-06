import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import IdentificationType from '../models/IdentificationType.js';

export default class IdentificationTypeRepository extends BaseRepository {
  constructor() { super('identification_types', 'id'); }

  async crear(datos) {
    const tipo = new IdentificationType(datos);
    const [result] = await pool.query(
      `INSERT INTO identification_types (code, name, description) VALUES (?, ?, ?)`,
      [tipo.code, tipo.name, tipo.description]
    );
    return { ...tipo, id: result.insertId };
  }
}
