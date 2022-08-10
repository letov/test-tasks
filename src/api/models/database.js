import { configDB } from "../../config.js";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: configDB.user,
    host: configDB.host,
    database: configDB.database,
    password: configDB.password,
    port: configDB.port,
    max: configDB.max,
});

const client = await pool.connect();

export { client }
