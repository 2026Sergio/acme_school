import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import Rate from '../models/Rate.js';

export default class RateRepository extends BaseRepository {
  constructor() { super('rates', 'id'); }

  async crear(datos) {
    const rate = new Rate(datos);
    const [insc] = await pool.query('SELECT id FROM inscriptions WHERE id = ?', [rate.inscription_id]);
    if (insc.length === 0) throw new Error(`No existe la inscripción ${rate.inscription_id}`);

    const [result] = await pool.query(
      `INSERT INTO rates (inscription_id, rate, comments) VALUES (?, ?, ?)`,
      [rate.inscription_id, rate.rate, rate.comments]
    );
    return { ...rate, id: result.insertId };
  }

  async listarPorInscripcion(inscription_id) {
    const [rows] = await pool.query('SELECT * FROM rates WHERE inscription_id = ? ORDER BY id', [inscription_id]);
    return rows;
  }
}
