
import { pool } from "../src/db/index.js";

try {
  const result = await pool.query(
    "SELECT current_database() AS database, NOW() AS server_time",
  );

  console.log("Conexão com PostgreSQL estabelecida!");
  console.log(result.rows[0]);
} catch (error) {
  console.error("Erro ao conectar com PostgreSQL:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
