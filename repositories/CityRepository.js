import pool from '../config/database.js';
import BaseRepository from './BaseRepository.js';
import City from '../models/City.js';

export default class CityRepository extends BaseRepository {
  constructor() { super('cities', 'id'); }

  async crear(datos) {
    const city = new City(datos);
    const [result] = await pool.query(`INSERT INTO cities (code, name) VALUES (?, ?)`, [city.code, city.name]);
    return { ...city, id: result.insertId };
  }
}
