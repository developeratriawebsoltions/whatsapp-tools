import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'mysql',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'root',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'whatsapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = RowDataPacket>(sql: string, values: any[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, values as any);
  return rows as T[];
}

export async function execute(sql: string, values: any[] = []): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await pool.execute(sql, values as any);
  const header = result as { insertId?: number; affectedRows?: number };
  return {
    insertId: header.insertId ?? 0,
    affectedRows: header.affectedRows ?? 0,
  };
}
