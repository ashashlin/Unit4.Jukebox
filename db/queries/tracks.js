import db from "#db/client";

export async function createTrack(name, duration_ms) {
  const sql = `
    INSERT INTO tracks(
      name,
      duration_ms
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [name, duration_ms]);

  return rows[0];
}
