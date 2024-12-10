import { Pool } from 'pg';

const pool = new Pool({
    user: 'admin',
    host: 'localhost:27017',
    database: 'kickside-rw-bn',
    port: 5432,
});

export default pool;
