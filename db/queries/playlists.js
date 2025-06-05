import db from "#db/client";

export async function createPlaylist(name, description) {
  const sql = `
    INSERT INTO playlists(
      name,
      description
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [name, description]);

  return rows[0];
}
