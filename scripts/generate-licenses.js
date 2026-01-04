// scripts/generate-licenses.js
import { randomUUID } from "crypto";
import pg from "pg";
import fs from "fs";

const { Pool } = pg;

const COUNT = Number(process.env.LICENSE_COUNT || 500);
const NOTES = process.env.LICENSE_NOTES || "estoque Hotmart";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definido");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();

  try {
    const licenses = [];

    for (let i = 0; i < COUNT; i++) {
      licenses.push({
        user_key: randomUUID(),
        status: "active",
        max_devices: 1,
        notes: NOTES,
      });
    }

    await client.query("BEGIN");

    for (const l of licenses) {
      await client.query(
        `INSERT INTO licenses (user_key, status, max_devices, notes)
         VALUES ($1, $2, $3, $4)`,
        [l.user_key, l.status, l.max_devices, l.notes]
      );
    }

    await client.query("COMMIT");

    const header = "user_key,status,max_devices,notes\n";
    const rows = licenses
      .map(l => `${l.user_key},${l.status},${l.max_devices},"${l.notes}"`)
      .join("\n");

    fs.writeFileSync("licenses.csv", header + rows);

    console.log(`✅ ${licenses.length} licenças geradas e inseridas`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error("❌ Erro ao gerar licenças:", err);
  process.exit(1);
});
